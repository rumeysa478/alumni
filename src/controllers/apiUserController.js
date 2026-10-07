/**
 * @file src/controllers/apiUserController.js
 * @description REST API Kontrolcüsü (JSON yanıt dönen ApiUserController)
 */

import userModel from '../models/user.model.js';

/**
 * Gelen istek gövdesi veya query parametrelerinden alanları esnek şekilde ayıklar
 */
const extractUserFields = (req) => {
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

export const ApiUserController = {
  /**
   * Tüm kullanıcıları listeleme
   * GET /api/users
   */
  getUsers: (req, res) => {
    try {
      const search = req.query.search || req.query.q;
      const role = req.query.role;
      const department = req.query.department;

      const users = userModel.getAll({ search, role, department });

      return res.status(200).json({
        success: true,
        count: users.length,
        data: users
      });
    } catch (error) {
      console.error('API Kullanıcı listesi hatası:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Kullanıcılar listelenirken bir hata oluştu.'
      });
    }
  },

  /**
   * ID'ye göre tekil kullanıcı getirme
   * GET /api/users/:id
   */
  getUserById: (req, res) => {
    try {
      const userId = parseInt(req.params.id, 10);
      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Geçersiz kullanıcı ID formatı.'
        });
      }

      const user = userModel.getById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: `ID ${userId} olan kullanıcı bulunamadı.`
        });
      }

      return res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('API Kullanıcı getirme hatası:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Kullanıcı getirilirken bir hata oluştu.'
      });
    }
  },

  /**
   * Yeni kullanıcı oluşturma
   * POST /api/users
   */
  createUser: (req, res) => {
    try {
      const fields = extractUserFields(req);
      const { email, password, first_name, last_name, role = 'ALUMNI', department, graduation_year } = fields;

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

      const newUser = userModel.create({
        email,
        password,
        first_name,
        last_name,
        role,
        department,
        graduation_year
      });

      console.log(`[REST API] Kullanıcı oluşturuldu: ID ${newUser.id}`);
      return res.status(201).json({
        success: true,
        message: 'Kullanıcı başarıyla oluşturuldu (In-Memory).',
        data: newUser
      });
    } catch (error) {
      if (error.code === 409) {
        return res.status(409).json({
          success: false,
          error: 'Conflict',
          message: error.message
        });
      }
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: error.message
      });
    }
  },

  /**
   * Kullanıcı tam güncelleme (PUT)
   * PUT /api/users/:id
   */
  updateUser: (req, res) => {
    try {
      const userId = parseInt(req.params.id, 10);
      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Geçersiz kullanıcı ID formatı.'
        });
      }

      const fields = extractUserFields(req);
      const updatedUser = userModel.update(userId, fields);

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: `ID ${userId} olan kullanıcı bulunamadı.`
        });
      }

      console.log(`[REST API] Kullanıcı güncellendi (PUT): ID ${userId}`);
      return res.status(200).json({
        success: true,
        message: `ID ${userId} olan kullanıcı başarıyla güncellendi (PUT).`,
        data: updatedUser
      });
    } catch (error) {
      if (error.code === 409) {
        return res.status(409).json({
          success: false,
          error: 'Conflict',
          message: error.message
        });
      }
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: error.message
      });
    }
  },

  /**
   * Kullanıcı kısmi güncelleme (PATCH)
   * PATCH /api/users/:id
   */
  patchUser: (req, res) => {
    try {
      const userId = parseInt(req.params.id, 10);
      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Geçersiz kullanıcı ID formatı.'
        });
      }

      const fields = extractUserFields(req);
      const updatedUser = userModel.patch(userId, fields);

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: `ID ${userId} olan kullanıcı bulunamadı.`
        });
      }

      console.log(`[REST API] Kullanıcı güncellendi (PATCH): ID ${userId}`);
      return res.status(200).json({
        success: true,
        message: `ID ${userId} olan kullanıcı başarıyla kısmi güncellendi (PATCH).`,
        data: updatedUser
      });
    } catch (error) {
      if (error.code === 409) {
        return res.status(409).json({
          success: false,
          error: 'Conflict',
          message: error.message
        });
      }
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: error.message
      });
    }
  },

  /**
   * Kullanıcı silme (DELETE)
   * DELETE /api/users/:id
   */
  deleteUser: (req, res) => {
    try {
      const userId = parseInt(req.params.id, 10);
      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Geçersiz kullanıcı ID formatı.'
        });
      }

      const deletedUser = userModel.delete(userId);
      if (!deletedUser) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: `ID ${userId} olan kullanıcı bulunamadı.`
        });
      }

      console.log(`[REST API] Kullanıcı silindi: ID ${userId}`);
      return res.status(200).json({
        success: true,
        message: `ID ${userId} olan kullanıcı başarıyla silindi.`,
        data: deletedUser
      });
    } catch (error) {
      console.error('API Kullanıcı silme hatası:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Kullanıcı silinirken bir sunucu hatası oluştu.'
      });
    }
  }
};

// Fonksiyonları doğrudan da dışa aktar (mevcut importlarla uyumluluk için)
export const getUsers = ApiUserController.getUsers;
export const getUserById = ApiUserController.getUserById;
export const createUser = ApiUserController.createUser;
export const updateUser = ApiUserController.updateUser;
export const patchUser = ApiUserController.patchUser;
export const deleteUser = ApiUserController.deleteUser;

export default ApiUserController;
