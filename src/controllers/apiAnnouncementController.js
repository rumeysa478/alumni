/**
 * @file src/controllers/apiAnnouncementController.js
 * @description REST API Duyuru Kontrolcüsü (JSON yanıt dönen ApiAnnouncementController - DB Connected)
 */

import announcementModel from '../models/announcement.model.js';

/**
 * Gelen istek gövdesi veya query parametrelerinden duyuru alanlarını ayıklar
 */
const extractAnnouncementFields = (req) => {
  const payload = { ...req.query, ...req.body };

  const title = payload.title ?? payload.baslik;
  const content = payload.content ?? payload.icerik ?? payload.description;
  const category = payload.category ?? payload.kategori;
  const author = payload.author ?? payload.yazar;
  const target_audience = payload.target_audience ?? payload.targetAudience ?? payload.hedef_kitle;
  const is_active = payload.is_active ?? payload.isActive ?? payload.aktif;

  return {
    title,
    content,
    category,
    author,
    target_audience,
    is_active
  };
};

export const ApiAnnouncementController = {
  /**
   * Tüm duyuruları listeleme
   * GET /api/announcements
   */
  getAnnouncements: async (req, res) => {
    try {
      const search = req.query.search || req.query.q;
      const category = req.query.category;
      const target_audience = req.query.target_audience;
      const is_active = req.query.is_active;

      const announcements = await announcementModel.getAll({
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
        message: 'Duyurular listelenirken bir hata oluştu.'
      });
    }
  },

  /**
   * ID'ye göre tekil duyuru getirme
   * GET /api/announcements/:id
   */
  getAnnouncementById: async (req, res) => {
    try {
      const announcementId = parseInt(req.params.id, 10);
      if (isNaN(announcementId)) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Geçersiz duyuru ID formatı.'
        });
      }

      const announcement = await announcementModel.getById(announcementId);
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
        message: 'Duyuru getirilirken bir hata oluştu.'
      });
    }
  },

  /**
   * Yeni duyuru oluşturma
   * POST /api/announcements
   */
  createAnnouncement: async (req, res) => {
    try {
      const fields = extractAnnouncementFields(req);
      const { title, content, category, author, target_audience, is_active } = fields;

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

      const newAnnouncement = await announcementModel.create({
        title,
        content,
        category,
        author,
        target_audience,
        is_active: is_active !== undefined ? is_active : true
      });

      console.log(`[REST API] Duyuru oluşturuldu: ID ${newAnnouncement.id}`);
      return res.status(201).json({
        success: true,
        message: 'Duyuru başarıyla oluşturuldu.',
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
   * Duyuru tam güncelleme (PUT)
   * PUT /api/announcements/:id
   */
  updateAnnouncement: async (req, res) => {
    try {
      const announcementId = parseInt(req.params.id, 10);
      if (isNaN(announcementId)) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Geçersiz duyuru ID formatı.'
        });
      }

      const fields = extractAnnouncementFields(req);
      const updated = await announcementModel.update(announcementId, fields);

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
   * Duyuru kısmi güncelleme (PATCH)
   * PATCH /api/announcements/:id
   */
  patchAnnouncement: async (req, res) => {
    try {
      const announcementId = parseInt(req.params.id, 10);
      if (isNaN(announcementId)) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Geçersiz duyuru ID formatı.'
        });
      }

      const fields = extractAnnouncementFields(req);
      const patched = await announcementModel.patch(announcementId, fields);

      if (!patched) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: `ID #${announcementId} olan duyuru bulunamadı.`
        });
      }

      console.log(`[REST API] Duyuru güncellendi (PATCH): ID ${announcementId}`);
      return res.status(200).json({
        success: true,
        message: `ID #${announcementId} olan duyuru başarıyla güncellendi (PATCH).`,
        data: patched
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
   * Duyuru silme (DELETE)
   * DELETE /api/announcements/:id
   */
  deleteAnnouncement: async (req, res) => {
    try {
      const announcementId = parseInt(req.params.id, 10);
      if (isNaN(announcementId)) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Geçersiz duyuru ID formatı.'
        });
      }

      const deleted = await announcementModel.delete(announcementId);
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
        message: 'Duyuru silinirken bir hata oluştu.'
      });
    }
  }
};

export default ApiAnnouncementController;
