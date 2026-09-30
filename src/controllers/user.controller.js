// In-memory user storage (Veritabanı entegrasyonu öncesi geçici bellek içi liste)
const users = [];
let nextUserId = 1;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_ROLES = ['STUDENT', 'ALUMNI', 'ADMIN'];

/**
 * Gelen istek gövdesi veya query parametrelerinden alanları esnek şekilde ayıklar
 */
const extractUserFields = (req) => {
  // Hem Body (form-data, x-www-form-urlencoded, json) hem de Params (Query) desteklenir
  const payload = { ...req.query, ...req.body };

  const email = payload.email ?? payload.mail ?? payload['e-mail'] ?? payload.e_mail;
  const password = payload.password ?? payload.pass ?? payload.sifre;
  const firstName = payload.first_name ?? payload.firstName ?? payload.name ?? payload.isim;
  const lastName = payload.last_name ?? payload.lastName ?? payload.surname ?? payload.soyisim;
  const role = payload.role ?? payload.rol;
  const department = payload.department ?? payload.bolum;
  const gradYear = payload.graduation_year ?? payload.graduationYear ?? payload.mezuniyet_yili;
  const isVerified = payload.is_verified ?? payload.isVerified;

  return {
    email,
    password,
    first_name: firstName,
    last_name: lastName,
    role,
    department,
    graduation_year: gradYear,
    is_verified: isVerified
  };
};

/**
 * Yeni kullanıcı oluşturma
 * POST /api/users
 */
export const createUser = (req, res) => {
  try {
    const fields = extractUserFields(req);
    const { email, password, first_name, last_name, role = 'ALUMNI', department, graduation_year } = fields;

    // Zorunlu alan kontrolü
    if (!email || !String(email).trim()) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'E-posta (email) alanı zorunludur.'
      });
    }

    if (!password || !String(password).trim()) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Şifre (password) alanı zorunludur.'
      });
    }

    const trimmedEmail = String(email).trim().toLowerCase();

    // E-posta format doğrulaması
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Geçerli bir e-posta adresi giriniz.'
      });
    }

    // E-posta benzersizlik kontrolü (in-memory)
    const existingUser = users.find(u => u.email.toLowerCase() === trimmedEmail);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'Conflict',
        message: 'Bu e-posta adresiyle kayıtlı bir kullanıcı zaten mevcut.'
      });
    }

    // Rol doğrulaması
    const userRole = String(role).toUpperCase();
    if (!VALID_ROLES.includes(userRole)) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: `Geçersiz rol. Kabul edilen roller: ${VALID_ROLES.join(', ')}`
      });
    }

    // Yeni kullanıcı nesnesi
    const newUser = {
      id: nextUserId++,
      email: trimmedEmail,
      first_name: first_name ? String(first_name).trim() : '',
      last_name: last_name ? String(last_name).trim() : '',
      role: userRole,
      department: department ? String(department).trim() : '',
      graduation_year: graduation_year ? parseInt(graduation_year, 10) || null : null,
      is_verified: false,
      created_at: new Date().toISOString()
    };

    users.push(newUser);
    console.log(`[USER CREATED] ID: ${newUser.id}, Email: ${newUser.email}`);

    return res.status(201).json({
      success: true,
      message: 'Kullanıcı başarıyla oluşturuldu (In-Memory).',
      data: newUser
    });
  } catch (error) {
    console.error('Kullanıcı oluşturulurken hata:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Kullanıcı eklenirken bir sunucu hatası oluştu.'
    });
  }
};

/**
 * Tüm kullanıcıları listeleme
 * GET /api/users
 */
export const getUsers = (req, res) => {
  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
};

/**
 * ID'ye göre tekil kullanıcı getirme
 * GET /api/users/:id
 */
export const getUserById = (req, res) => {
  const userId = parseInt(req.params.id, 10);
  if (isNaN(userId)) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Geçersiz kullanıcı ID formatı.'
    });
  }

  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `ID ${userId} olan kullanıcı bulunamadı.`
    });
  }

  res.status(200).json({
    success: true,
    data: user
  });
};

/**
 * Kullanıcı kaydını tam güncelleme (Full Update)
 * PUT /api/users/:id
 */
export const updateUser = (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Geçersiz kullanıcı ID formatı.'
      });
    }

    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `ID ${userId} olan kullanıcı bulunamadı.`
      });
    }

    const existingUser = users[userIndex];
    const fields = extractUserFields(req);
    const { email, first_name, last_name, role, department, graduation_year, is_verified } = fields;

    console.log(`[USER PUT UPDATE] ID: ${userId}, Received fields:`, fields);

    // E-posta güncelleniyorsa doğrulama ve benzersizlik kontrolü
    let updatedEmail = existingUser.email;
    if (email !== undefined && email !== null) {
      const emailStr = String(email).trim().toLowerCase();
      if (!emailStr || !EMAIL_REGEX.test(emailStr)) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: 'Geçerli bir e-posta adresi giriniz.'
        });
      }
      const duplicateUser = users.find(
        u => u.id !== userId && u.email.toLowerCase() === emailStr
      );
      if (duplicateUser) {
        return res.status(409).json({
          success: false,
          error: 'Conflict',
          message: 'Bu e-posta adresi başka bir kullanıcı tarafından kullanılıyor.'
        });
      }
      updatedEmail = emailStr;
    }

    // Rol doğrulaması
    let updatedRole = existingUser.role;
    if (role !== undefined && role !== null) {
      const formattedRole = String(role).toUpperCase();
      if (!VALID_ROLES.includes(formattedRole)) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: `Geçersiz rol. Kabul edilen roller: ${VALID_ROLES.join(', ')}`
        });
      }
      updatedRole = formattedRole;
    }

    // PUT ile tüm güncellenebilir alanların revize edilmesi
    const updatedUser = {
      ...existingUser,
      email: updatedEmail,
      first_name: first_name !== undefined ? String(first_name).trim() : '',
      last_name: last_name !== undefined ? String(last_name).trim() : '',
      role: updatedRole,
      department: department !== undefined ? String(department).trim() : '',
      graduation_year: graduation_year !== undefined
        ? (parseInt(graduation_year, 10) || null)
        : null,
      is_verified: is_verified !== undefined
        ? Boolean(is_verified === true || is_verified === 'true')
        : existingUser.is_verified,
      updated_at: new Date().toISOString()
    };

    users[userIndex] = updatedUser;
    console.log(`[USER PUT SUCCESS] ID: ${userId}, New Email: ${updatedUser.email}`);

    return res.status(200).json({
      success: true,
      message: `ID ${userId} olan kullanıcı başarıyla güncellendi (PUT).`,
      data: updatedUser
    });
  } catch (error) {
    console.error('Kullanıcı güncellenirken hata:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Kullanıcı güncellenirken bir sunucu hatası oluştu.'
    });
  }
};

/**
 * Kullanıcı kaydını kısmi güncelleme (Partial Update)
 * PATCH /api/users/:id
 */
export const patchUser = (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Geçersiz kullanıcı ID formatı.'
      });
    }

    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `ID ${userId} olan kullanıcı bulunamadı.`
      });
    }

    const existingUser = users[userIndex];
    const fields = extractUserFields(req);
    const { email, first_name, last_name, role, department, graduation_year, is_verified } = fields;

    console.log(`[USER PATCH UPDATE] ID: ${userId}, Received fields:`, fields);

    const patchData = {};

    // E-posta güncelleniyorsa
    if (email !== undefined && email !== null) {
      const emailStr = String(email).trim().toLowerCase();
      if (!emailStr || !EMAIL_REGEX.test(emailStr)) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: 'Geçerli bir e-posta adresi giriniz.'
        });
      }
      const duplicateUser = users.find(
        u => u.id !== userId && u.email.toLowerCase() === emailStr
      );
      if (duplicateUser) {
        return res.status(409).json({
          success: false,
          error: 'Conflict',
          message: 'Bu e-posta adresi başka bir kullanıcı tarafından kullanılıyor.'
        });
      }
      patchData.email = emailStr;
    }

    // Rol güncelleniyorsa
    if (role !== undefined && role !== null) {
      const formattedRole = String(role).toUpperCase();
      if (!VALID_ROLES.includes(formattedRole)) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: `Geçersiz rol. Kabul edilen roller: ${VALID_ROLES.join(', ')}`
        });
      }
      patchData.role = formattedRole;
    }

    if (first_name !== undefined && first_name !== null) {
      patchData.first_name = String(first_name).trim();
    }

    if (last_name !== undefined && last_name !== null) {
      patchData.last_name = String(last_name).trim();
    }

    if (department !== undefined && department !== null) {
      patchData.department = String(department).trim();
    }

    if (graduation_year !== undefined && graduation_year !== null) {
      patchData.graduation_year = parseInt(graduation_year, 10) || null;
    }

    if (is_verified !== undefined && is_verified !== null) {
      patchData.is_verified = Boolean(is_verified === true || is_verified === 'true');
    }

    patchData.updated_at = new Date().toISOString();

    const updatedUser = {
      ...existingUser,
      ...patchData
    };

    users[userIndex] = updatedUser;
    console.log(`[USER PATCH SUCCESS] ID: ${userId}, New Email: ${updatedUser.email}`);

    return res.status(200).json({
      success: true,
      message: `ID ${userId} olan kullanıcı başarıyla kısmi güncellendi (PATCH).`,
      data: updatedUser
    });
  } catch (error) {
    console.error('Kullanıcı güncellenirken hata:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Kullanıcı güncellenirken bir sunucu hatası oluştu.'
    });
  }
};

/**
 * ID'ye göre kullanıcı silme
 * DELETE /api/users/:id
 */
export const deleteUser = (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Geçersiz kullanıcı ID formatı.'
      });
    }

    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `ID ${userId} olan kullanıcı bulunamadı.`
      });
    }

    const deletedUser = users.splice(userIndex, 1)[0];
    console.log(`[USER DELETED] ID: ${userId}, Email: ${deletedUser.email}`);

    return res.status(200).json({
      success: true,
      message: `ID ${userId} olan kullanıcı başarıyla silindi.`,
      data: deletedUser
    });
  } catch (error) {
    console.error('Kullanıcı silinirken hata:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Kullanıcı silinirken bir sunucu hatası oluştu.'
    });
  }
};

