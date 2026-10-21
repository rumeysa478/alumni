/**
 * @file src/controllers/apiProfileController.js
 * @description REST API Mezun Profili Kontrolcüsü (ApiProfileController)
 * @author Rumeysa Aydın
 */

import { alumniProfileModel, userModel } from '../models/index.js';

export const ApiProfileController = {
  /**
   * GET /api/profiles - Tüm mezun profillerini listeleme
   */
  getProfiles: async (req, res) => {
    try {
      const profiles = await alumniProfileModel.getAll();
      return res.status(200).json({
        success: true,
        count: profiles.length,
        data: profiles
      });
    } catch (error) {
      console.error('API Profil listesi hatası:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Profiller listelenirken hata oluştu.'
      });
    }
  },

  /**
   * GET /api/profiles/:userId - Kullanıcı ID'sine göre profil getirme
   */
  getProfileByUserId: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await userModel.getById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: `ID #${userId} numaralı kullanıcı bulunamadı.`
        });
      }

      const profile = await alumniProfileModel.getByUserId(userId);
      return res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            department: user.department,
            graduation_year: user.graduation_year,
            role: user.role
          },
          profile: profile || null
        }
      });
    } catch (error) {
      console.error('API Profil detay hatası:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Profil detayları alınamadı.'
      });
    }
  },

  /**
   * POST /api/profiles - Yeni mezun profili oluşturma
   */
  createProfile: async (req, res) => {
    try {
      const { user_id } = req.body;
      if (!user_id) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: 'user_id zorunludur.'
        });
      }

      const profile = await alumniProfileModel.create(req.body);
      return res.status(201).json({
        success: true,
        message: 'Profil başarıyla oluşturuldu.',
        data: profile
      });
    } catch (error) {
      if (error.code === 409) {
        return res.status(409).json({
          success: false,
          error: 'Conflict',
          message: error.message
        });
      }
      console.error('API Profil oluşturma hatası:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error.message || 'Profil oluşturulamadı.'
      });
    }
  },

  /**
   * PUT /api/profiles/:userId - Profil güncelleme
   */
  updateProfile: async (req, res) => {
    try {
      const { userId } = req.params;
      const updated = await alumniProfileModel.updateByUserId(userId, req.body);
      if (!updated) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: `Kullanıcı ID #${userId} için güncellenecek profil bulunamadı.`
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Profil başarıyla güncellendi.',
        data: updated
      });
    } catch (error) {
      console.error('API Profil güncelleme hatası:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error.message || 'Profil güncellenemedi.'
      });
    }
  }
};

export default ApiProfileController;
