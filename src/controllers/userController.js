/**
 * @file src/controllers/userController.js
 * @description Web View Katmanı Kontrolcüsü (HTML / EJS şablonlarını render eden UserController)
 */

import userModel from '../models/user.model.js';

export const UserController = {
  /**
   * Kullanıcıları listeleme sayfası (Read - R)
   * GET /users
   */
  listUsers: (req, res) => {
    try {
      const search = req.query.search || req.query.q || '';
      const role = req.query.role || '';
      const department = req.query.department || '';

      const users = userModel.getAll({ search, role, department });

      res.render('users/index', {
        title: 'Mezun ve Öğrenci Listesi',
        users,
        filters: { search, role, department },
        successMessage: req.query.success || null,
        errorMessage: req.query.error || null
      });
    } catch (error) {
      console.error('Kullanıcı listesi render hatası:', error);
      res.status(500).render('error', {
        title: 'Hata',
        message: 'Kullanıcı listesi yüklenirken bir hata oluştu.'
      });
    }
  },

  /**
   * Tekil kullanıcı detay sayfası (Read - R)
   * GET /users/:id
   */
  showUser: (req, res) => {
    try {
      const user = userModel.getById(req.params.id);
      if (!user) {
        return res.status(404).render('error', {
          title: 'Kullanıcı Bulunamadı',
          message: `ID ${req.params.id} numaralı kullanıcı sistemde bulunamadı.`
        });
      }

      res.render('users/show', {
        title: `${user.first_name} ${user.last_name} | Profil`,
        user,
        successMessage: req.query.success || null
      });
    } catch (error) {
      console.error('Kullanıcı detay render hatası:', error);
      res.status(500).render('error', {
        title: 'Hata',
        message: 'Kullanıcı detayları yüklenirken bir hata oluştu.'
      });
    }
  },

  /**
   * Yeni kullanıcı oluşturma formu (View)
   * GET /users/new
   */
  renderCreateForm: (req, res) => {
    res.render('users/new', {
      title: 'Yeni Kullanıcı Kaydı',
      formData: {},
      errorMessage: null
    });
  },

  /**
   * Yeni kullanıcı oluşturma işlemi (Create - C)
   * POST /users
   */
  createUser: (req, res) => {
    try {
      const {
        email,
        password,
        first_name,
        last_name,
        role,
        department,
        graduation_year,
        is_verified
      } = req.body;

      const newUser = userModel.create({
        email,
        password,
        first_name,
        last_name,
        role: role || 'ALUMNI',
        department,
        graduation_year,
        is_verified: is_verified === 'on' || is_verified === true || is_verified === 'true'
      });

      console.log(`[MVC VIEW] Yeni kullanıcı eklendi: ID=${newUser.id}, Email=${newUser.email}`);
      res.redirect(`/users?success=${encodeURIComponent('Kullanıcı başarıyla oluşturuldu.')}`);
    } catch (error) {
      console.error('Kullanıcı form oluşturma hatası:', error.message);
      res.status(400).render('users/new', {
        title: 'Yeni Kullanıcı Kaydı',
        formData: req.body,
        errorMessage: error.message
      });
    }
  },

  /**
   * Kullanıcı güncelleme formu (View)
   * GET /users/:id/edit
   */
  renderEditForm: (req, res) => {
    try {
      const user = userModel.getById(req.params.id);
      if (!user) {
        return res.status(404).render('error', {
          title: 'Kullanıcı Bulunamadı',
          message: `ID ${req.params.id} numaralı kullanıcı bulunamadı.`
        });
      }

      res.render('users/edit', {
        title: `${user.first_name} ${user.last_name} Bilgilerini Düzenle`,
        user,
        errorMessage: null
      });
    } catch (error) {
      console.error('Kullanıcı düzenleme sayfası hatası:', error);
      res.status(500).render('error', {
        title: 'Hata',
        message: 'Düzenleme sayfası yüklenirken bir hata oluştu.'
      });
    }
  },

  /**
   * Kullanıcı güncelleme işlemi (Update - U)
   * POST /users/:id (veya PUT /users/:id)
   */
  updateUser: (req, res) => {
    try {
      const userId = req.params.id;
      const {
        email,
        password,
        first_name,
        last_name,
        role,
        department,
        graduation_year,
        is_verified
      } = req.body;

      const updated = userModel.update(userId, {
        email,
        password,
        first_name,
        last_name,
        role,
        department,
        graduation_year,
        is_verified: is_verified === 'on' || is_verified === true || is_verified === 'true'
      });

      if (!updated) {
        return res.status(404).render('error', {
          title: 'Kullanıcı Bulunamadı',
          message: `ID ${userId} numaralı kullanıcı bulunamadı.`
        });
      }

      console.log(`[MVC VIEW] Kullanıcı güncellendi: ID=${userId}`);
      res.redirect(`/users/${userId}?success=${encodeURIComponent('Kullanıcı bilgileri başarıyla güncellendi.')}`);
    } catch (error) {
      console.error('Kullanıcı form güncelleme hatası:', error.message);
      res.status(400).render('users/edit', {
        title: 'Kullanıcı Bilgilerini Düzenle',
        user: { ...req.body, id: req.params.id },
        errorMessage: error.message
      });
    }
  },

  /**
   * Kullanıcı silme işlemi (Delete - D)
   * POST /users/:id/delete (veya DELETE /users/:id)
   */
  deleteUser: (req, res) => {
    try {
      const userId = req.params.id;
      const deleted = userModel.delete(userId);

      if (!deleted) {
        return res.status(404).render('error', {
          title: 'Kullanıcı Bulunamadı',
          message: `ID ${userId} numaralı kullanıcı bulunamadı.`
        });
      }

      console.log(`[MVC VIEW] Kullanıcı silindi: ID=${userId}`);
      res.redirect(`/users?success=${encodeURIComponent('Kullanıcı başarıyla silindi.')}`);
    } catch (error) {
      console.error('Kullanıcı silme hatası:', error.message);
      res.status(500).render('error', {
        title: 'Hata',
        message: 'Kullanıcı silinirken bir hata oluştu.'
      });
    }
  }
};

export default UserController;
