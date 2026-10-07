/**
 * @file src/models/user.model.js
 * @description In-memory User Model for Alumni Tracking System (Veritabanı bağlantısı olmadan CRUD işlevleri)
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_ROLES = ['STUDENT', 'ALUMNI', 'ADMIN'];

class UserModel {
  constructor() {
    this.users = [];
    this.nextId = 1;
    this.seedInitialData();
  }

  /**
   * Başlangıç örnek verilerini yükler
   */
  seedInitialData() {
    const seedUsers = [
      {
        email: 'rumeysa.aydin@alumni.edu',
        password: 'password123',
        first_name: 'Rümeysa',
        last_name: 'Aydın',
        role: 'ALUMNI',
        department: 'Yönetim Bilişim Sistemleri',
        graduation_year: 2024,
        is_verified: true
      },
      {
        email: 'ahmet.yilmaz@alumni.edu',
        password: 'password123',
        first_name: 'Ahmet',
        last_name: 'Yılmaz',
        role: 'STUDENT',
        department: 'Bilgisayar Mühendisliği',
        graduation_year: 2026,
        is_verified: true
      },
      {
        email: 'zeynep.kaya@alumni.edu',
        password: 'password123',
        first_name: 'Zeynep',
        last_name: 'Kaya',
        role: 'ADMIN',
        department: 'Yazılım Mühendisliği',
        graduation_year: 2022,
        is_verified: true
      }
    ];

    seedUsers.forEach(u => this.create(u));
  }

  /**
   * Tüm kullanıcıları döner (isteğe bağlı arama veya filtreleme desteği)
   * @param {Object} filters
   * @returns {Array}
   */
  getAll(filters = {}) {
    let result = [...this.users];

    if (filters.search) {
      const q = String(filters.search).toLowerCase().trim();
      result = result.filter(u =>
        u.first_name.toLowerCase().includes(q) ||
        u.last_name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.department && u.department.toLowerCase().includes(q))
      );
    }

    if (filters.role) {
      const r = String(filters.role).toUpperCase().trim();
      result = result.filter(u => u.role === r);
    }

    if (filters.department) {
      const d = String(filters.department).toLowerCase().trim();
      result = result.filter(u => u.department && u.department.toLowerCase().includes(d));
    }

    return result;
  }

  /**
   * ID'ye göre tekil kullanıcı bulur
   * @param {number|string} id
   * @returns {Object|null}
   */
  getById(id) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return null;
    return this.users.find(u => u.id === numericId) || null;
  }

  /**
   * E-posta adresine göre kullanıcı bulur
   * @param {string} email
   * @returns {Object|null}
   */
  getByEmail(email) {
    if (!email) return null;
    const cleanEmail = String(email).trim().toLowerCase();
    return this.users.find(u => u.email.toLowerCase() === cleanEmail) || null;
  }

  /**
   * Yeni kullanıcı oluşturur (Create - C)
   * @param {Object} userData
   * @returns {Object}
   */
  create(userData) {
    const {
      email,
      password,
      first_name = '',
      last_name = '',
      role = 'ALUMNI',
      department = '',
      graduation_year = null,
      is_verified = false
    } = userData;

    if (!email || !String(email).trim()) {
      throw new Error('E-posta (email) alanı zorunludur.');
    }

    const cleanEmail = String(email).trim().toLowerCase();
    if (!EMAIL_REGEX.test(cleanEmail)) {
      throw new Error('Geçerli bir e-posta adresi giriniz.');
    }

    const existingUser = this.getByEmail(cleanEmail);
    if (existingUser) {
      const err = new Error('Bu e-posta adresiyle kayıtlı bir kullanıcı zaten mevcut.');
      err.code = 409;
      throw err;
    }

    const userRole = String(role).toUpperCase().trim();
    if (!VALID_ROLES.includes(userRole)) {
      throw new Error(`Geçersiz rol. Kabul edilen roller: ${VALID_ROLES.join(', ')}`);
    }

    const newUser = {
      id: this.nextId++,
      email: cleanEmail,
      password: password ? String(password).trim() : 'secret123',
      first_name: first_name ? String(first_name).trim() : '',
      last_name: last_name ? String(last_name).trim() : '',
      role: userRole,
      department: department ? String(department).trim() : '',
      graduation_year: graduation_year ? parseInt(graduation_year, 10) || null : null,
      is_verified: Boolean(is_verified === true || is_verified === 'true'),
      created_at: new Date().toISOString(),
      updated_at: null
    };

    this.users.push(newUser);
    return newUser;
  }

  /**
   * Kullanıcıyı tam günceller (Update - U)
   * @param {number|string} id
   * @param {Object} updateData
   * @returns {Object|null}
   */
  update(id, updateData) {
    const user = this.getById(id);
    if (!user) return null;

    const {
      email,
      password,
      first_name,
      last_name,
      role,
      department,
      graduation_year,
      is_verified
    } = updateData;

    if (email !== undefined && email !== null) {
      const cleanEmail = String(email).trim().toLowerCase();
      if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
        throw new Error('Geçerli bir e-posta adresi giriniz.');
      }
      const existing = this.getByEmail(cleanEmail);
      if (existing && existing.id !== user.id) {
        const err = new Error('Bu e-posta adresi başka bir kullanıcı tarafından kullanılıyor.');
        err.code = 409;
        throw err;
      }
      user.email = cleanEmail;
    }

    if (role !== undefined && role !== null) {
      const userRole = String(role).toUpperCase().trim();
      if (!VALID_ROLES.includes(userRole)) {
        throw new Error(`Geçersiz rol. Kabul edilen roller: ${VALID_ROLES.join(', ')}`);
      }
      user.role = userRole;
    }

    if (password !== undefined && password !== null && String(password).trim()) {
      user.password = String(password).trim();
    }

    user.first_name = first_name !== undefined ? String(first_name).trim() : '';
    user.last_name = last_name !== undefined ? String(last_name).trim() : '';
    user.department = department !== undefined ? String(department).trim() : '';
    user.graduation_year = graduation_year !== undefined
      ? (parseInt(graduation_year, 10) || null)
      : null;

    if (is_verified !== undefined) {
      user.is_verified = Boolean(is_verified === true || is_verified === 'true');
    }

    user.updated_at = new Date().toISOString();
    return user;
  }

  /**
   * Kullanıcıyı kısmi günceller (Patch - U)
   * @param {number|string} id
   * @param {Object} partialData
   * @returns {Object|null}
   */
  patch(id, partialData) {
    const user = this.getById(id);
    if (!user) return null;

    const {
      email,
      password,
      first_name,
      last_name,
      role,
      department,
      graduation_year,
      is_verified
    } = partialData;

    if (email !== undefined && email !== null) {
      const cleanEmail = String(email).trim().toLowerCase();
      if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
        throw new Error('Geçerli bir e-posta adresi giriniz.');
      }
      const existing = this.getByEmail(cleanEmail);
      if (existing && existing.id !== user.id) {
        const err = new Error('Bu e-posta adresi başka bir kullanıcı tarafından kullanılıyor.');
        err.code = 409;
        throw err;
      }
      user.email = cleanEmail;
    }

    if (role !== undefined && role !== null) {
      const userRole = String(role).toUpperCase().trim();
      if (!VALID_ROLES.includes(userRole)) {
        throw new Error(`Geçersiz rol. Kabul edilen roller: ${VALID_ROLES.join(', ')}`);
      }
      user.role = userRole;
    }

    if (password !== undefined && password !== null && String(password).trim()) {
      user.password = String(password).trim();
    }
    if (first_name !== undefined) user.first_name = String(first_name).trim();
    if (last_name !== undefined) user.last_name = String(last_name).trim();
    if (department !== undefined) user.department = String(department).trim();
    if (graduation_year !== undefined) {
      user.graduation_year = parseInt(graduation_year, 10) || null;
    }
    if (is_verified !== undefined) {
      user.is_verified = Boolean(is_verified === true || is_verified === 'true');
    }

    user.updated_at = new Date().toISOString();
    return user;
  }

  /**
   * Kullanıcıyı siler (Delete - D)
   * @param {number|string} id
   * @returns {Object|null}
   */
  delete(id) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return null;

    const index = this.users.findIndex(u => u.id === numericId);
    if (index === -1) return null;

    const [deletedUser] = this.users.splice(index, 1);
    return deletedUser;
  }

  /**
   * Verileri sıfırlar (Testler için)
   */
  reset() {
    this.users = [];
    this.nextId = 1;
    this.seedInitialData();
  }
}

// Singleton User Model nesnesi
export const userModel = new UserModel();
export default userModel;
