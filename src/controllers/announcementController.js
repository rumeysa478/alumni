/**
 * @file src/controllers/announcementController.js
 * @description Web View Katmanı Duyuru Kontrolcüsü (HTML / EJS şablonlarını render eden AnnouncementController)
 */

import announcementModel from '../models/announcement.model.js';

export const AnnouncementController = {
  /**
   * Duyuruları listeleme sayfası (Read - R)
   * GET /announcements
   */
  listAnnouncements: (req, res) => {
    try {
      const search = req.query.search || req.query.q || '';
      const category = req.query.category || '';
      const target_audience = req.query.target_audience || '';
      const is_active = req.query.is_active;

      const announcements = announcementModel.getAll({
        search,
        category,
        target_audience,
        is_active
      });

      res.render('announcements/index', {
        title: 'Duyurular ve Etkinlikler',
        announcements,
        filters: { search, category, target_audience, is_active },
        successMessage: req.query.success || null,
        errorMessage: req.query.error || null
      });
    } catch (error) {
      console.error('Duyuru listesi render hatası:', error);
      res.status(500).render('error', {
        title: 'Hata',
        message: 'Duyuru listesi yüklenirken bir hata oluştu.'
      });
    }
  },

  /**
   * Tekil duyuru detay sayfası (Read - R)
   * GET /announcements/:id
   */
  showAnnouncement: (req, res) => {
    try {
      const announcement = announcementModel.getById(req.params.id);
      if (!announcement) {
        return res.status(404).render('error', {
          title: 'Duyuru Bulunamadı',
          message: `ID #${req.params.id} numaralı duyuru bulunamadı.`
        });
      }

      res.render('announcements/show', {
        title: `${announcement.title} | Duyuru Detayı`,
        announcement,
        successMessage: req.query.success || null
      });
    } catch (error) {
      console.error('Duyuru detay render hatası:', error);
      res.status(500).render('error', {
        title: 'Hata',
        message: 'Duyuru detayları yüklenirken bir hata oluştu.'
      });
    }
  },

  /**
   * Yeni duyuru ekleme formu görünümü
   * GET /announcements/new
   */
  renderCreateForm: (req, res) => {
    res.render('announcements/new', {
      title: 'Yeni Duyuru Oluştur',
      formData: {},
      errorMessage: null
    });
  },

  /**
   * Yeni duyuru oluşturma işlemi (Create - C)
   * POST /announcements
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

      const newAnnouncement = announcementModel.create({
        title,
        content,
        category,
        author,
        target_audience,
        is_active: is_active === 'on' || is_active === true || is_active === 'true'
      });

      console.log(`[MVC VIEW] Yeni duyuru eklendi: ID=${newAnnouncement.id}, Başlık="${newAnnouncement.title}"`);
      res.redirect(`/announcements?success=${encodeURIComponent('Duyuru başarıyla oluşturuldu.')}`);
    } catch (error) {
      console.error('Duyuru form ekleme hatası:', error.message);
      res.status(400).render('announcements/new', {
        title: 'Yeni Duyuru Oluştur',
        formData: req.body,
        errorMessage: error.message
      });
    }
  },

  /**
   * Duyuru düzenleme formu görünümü
   * GET /announcements/:id/edit
   */
  renderEditForm: (req, res) => {
    try {
      const announcement = announcementModel.getById(req.params.id);
      if (!announcement) {
        return res.status(404).render('error', {
          title: 'Duyuru Bulunamadı',
          message: `ID #${req.params.id} numaralı duyuru bulunamadı.`
        });
      }

      res.render('announcements/edit', {
        title: `Duyuruyu Düzenle: ${announcement.title}`,
        announcement,
        errorMessage: null
      });
    } catch (error) {
      console.error('Duyuru düzenleme formu hatası:', error);
      res.status(500).render('error', {
        title: 'Hata',
        message: 'Duyuru düzenleme sayfası yüklenirken bir hata oluştu.'
      });
    }
  },

  /**
   * Duyuru güncelleme işlemi (Update - U)
   * POST /announcements/:id
   */
  updateAnnouncement: (req, res) => {
    try {
      const announcementId = req.params.id;
      const {
        title,
        content,
        category,
        author,
        target_audience,
        is_active
      } = req.body;

      const updated = announcementModel.update(announcementId, {
        title,
        content,
        category,
        author,
        target_audience,
        is_active: is_active === 'on' || is_active === true || is_active === 'true'
      });

      if (!updated) {
        return res.status(404).render('error', {
          title: 'Duyuru Bulunamadı',
          message: `ID #${announcementId} numaralı duyuru bulunamadı.`
        });
      }

      console.log(`[MVC VIEW] Duyuru güncellendi: ID=${announcementId}`);
      res.redirect(`/announcements/${announcementId}?success=${encodeURIComponent('Duyuru başarıyla güncellendi.')}`);
    } catch (error) {
      console.error('Duyuru güncelleme form hatası:', error.message);
      res.status(400).render('announcements/edit', {
        title: 'Duyuruyu Düzenle',
        announcement: { ...req.body, id: req.params.id },
        errorMessage: error.message
      });
    }
  },

  /**
   * Duyuru silme işlemi (Delete - D)
   * POST /announcements/:id/delete
   */
  deleteAnnouncement: (req, res) => {
    try {
      const announcementId = req.params.id;
      const deleted = announcementModel.delete(announcementId);

      if (!deleted) {
        return res.status(404).render('error', {
          title: 'Duyuru Bulunamadı',
          message: `ID #${announcementId} numaralı duyuru bulunamadı.`
        });
      }

      console.log(`[MVC VIEW] Duyuru silindi: ID=${announcementId}`);
      res.redirect(`/announcements?success=${encodeURIComponent('Duyuru başarıyla silindi.')}`);
    } catch (error) {
      console.error('Duyuru silme hatası:', error.message);
      res.status(500).render('error', {
        title: 'Hata',
        message: 'Duyuru silinirken bir hata oluştu.'
      });
    }
  }
};

export default AnnouncementController;
