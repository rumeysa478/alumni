/**
 * @file src/controllers/apiAnnouncementController.js
 * @description REST API Duyuru Kontrolcüsü (JSON yanıt dönen ApiAnnouncementController)
 */

import announcementModel from '../models/announcement.model.js';

export const ApiAnnouncementController = {
  /**
   * Tüm duyuruları listeleme
   * GET /api/announcements
   */
  getAnnouncements: (req, res) => {
    try {
      const search = req.query.search || req.query.q;
      const category = req.query.category;
      const target_audience = req.query.target_audience;
      const is_active = req.query.is_active;

      const announcements = announcementModel.getAll({
        search,
        category,
        target_audience,
        is_active
      });

      return res.status(200).json({
        success: true,
        count: announcements.length,
        data: announcements
      });
    } catch (error) {
      console.error('API Duyuru listesi hatası:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Duyurular listelenirken bir sunucu hatası oluştu.'
      });
    }
  },

  /**
   * ID ile tekil duyuru getirme
   * GET /api/announcements/:id
   */
  getAnnouncementById: (req, res) => {
    try {
      const announcementId = parseInt(req.params.id, 10);
      if (isNaN(announcementId)) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Geçersiz duyuru ID formatı.'
        });
      }

      const announcement = announcementModel.getById(announcementId);
      if (!announcement) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: `ID #${announcementId} olan duyuru bulunamadı.`
        });
      }

      return res.status(200).json({
        success: true,
        data: announcement
      });
    } catch (error) {
      console.error('API Duyuru getirme hatası:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Duyuru getirilirken bir sunucu hatası oluştu.'
      });
    }
  },

  /**
   * Yeni duyuru oluşturma
   * POST /api/announcements
   */
  createAnnouncement: (req, res) => {
    try {
      const {
        title,
        content,
        category,
        author,
        target_audience,
        is_active
      } = req.body;

      if (!title || !String(title).trim()) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: 'Duyuru başlığı (title) zorunludur.'
        });
      }

      if (!content || !String(content).trim()) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: 'Duyuru içeriği (content) zorunludur.'
        });
      }

      const newAnnouncement = announcementModel.create({
        title,
        content,
        category,
        author,
        target_audience,
        is_active
      });

      console.log(`[REST API] Duyuru oluşturuldu: ID ${newAnnouncement.id}`);
      return res.status(201).json({
        success: true,
        message: 'Duyuru başarıyla oluşturuldu (In-Memory).',
        data: newAnnouncement
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: error.message
      });
    }
  },

  /**
   * Duyuruyu tam güncelleme (PUT)
   * PUT /api/announcements/:id
   */
  updateAnnouncement: (req, res) => {
    try {
      const announcementId = parseInt(req.params.id, 10);
      if (isNaN(announcementId)) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Geçersiz duyuru ID formatı.'
        });
      }

      const updated = announcementModel.update(announcementId, req.body);
      if (!updated) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: `ID #${announcementId} olan duyuru bulunamadı.`
        });
      }

      console.log(`[REST API] Duyuru güncellendi (PUT): ID ${announcementId}`);
      return res.status(200).json({
        success: true,
        message: `ID #${announcementId} olan duyuru başarıyla güncellendi (PUT).`,
        data: updated
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: error.message
      });
    }
  },

  /**
   * Duyuruyu kısmi güncelleme (PATCH)
   * PATCH /api/announcements/:id
   */
  patchAnnouncement: (req, res) => {
    try {
      const announcementId = parseInt(req.params.id, 10);
      if (isNaN(announcementId)) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Geçersiz duyuru ID formatı.'
        });
      }

      const updated = announcementModel.patch(announcementId, req.body);
      if (!updated) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: `ID #${announcementId} olan duyuru bulunamadı.`
        });
      }

      console.log(`[REST API] Duyuru kısmi güncellendi (PATCH): ID ${announcementId}`);
      return res.status(200).json({
        success: true,
        message: `ID #${announcementId} olan duyuru başarıyla kısmi güncellendi (PATCH).`,
        data: updated
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: error.message
      });
    }
  },

  /**
   * Duyuruyu silme (DELETE)
   * DELETE /api/announcements/:id
   */
  deleteAnnouncement: (req, res) => {
    try {
      const announcementId = parseInt(req.params.id, 10);
      if (isNaN(announcementId)) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Geçersiz duyuru ID formatı.'
        });
      }

      const deleted = announcementModel.delete(announcementId);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: `ID #${announcementId} olan duyuru bulunamadı.`
        });
      }

      console.log(`[REST API] Duyuru silindi: ID ${announcementId}`);
      return res.status(200).json({
        success: true,
        message: `ID #${announcementId} olan duyuru başarıyla silindi.`,
        data: deleted
      });
    } catch (error) {
      console.error('API Duyuru silme hatası:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Duyuru silinirken bir sunucu hatası oluştu.'
      });
    }
  }
};

export const getAnnouncements = ApiAnnouncementController.getAnnouncements;
export const getAnnouncementById = ApiAnnouncementController.getAnnouncementById;
export const createAnnouncement = ApiAnnouncementController.createAnnouncement;
export const updateAnnouncement = ApiAnnouncementController.updateAnnouncement;
export const patchAnnouncement = ApiAnnouncementController.patchAnnouncement;
export const deleteAnnouncement = ApiAnnouncementController.deleteAnnouncement;

export default ApiAnnouncementController;
