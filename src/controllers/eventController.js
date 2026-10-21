/**
 * @file src/controllers/eventController.js
 * @description Web View Katmanı Etkinlik Kontrolcüsü (EventController - MVC View)
 * @author Rumeysa Aydın
 */

import { eventModel, eventAttendeeModel, userModel } from '../models/index.js';

export const EventController = {
  /**
   * GET /events - Etkinlik listesi
   */
  listEvents: async (req, res) => {
    try {
      const search = req.query.search || req.query.q || '';
      const events = await eventModel.getAll({ search });

      res.render('events/index', {
        title: 'Etkinlikler ve Buluşmalar',
        events,
        filters: { search },
        successMessage: req.query.success || null,
        errorMessage: req.query.error || null
      });
    } catch (error) {
      console.error('Etkinlik listesi hatası:', error);
      res.status(500).render('error', {
        title: 'Hata',
        message: 'Etkinlik listesi yüklenemedi.'
      });
    }
  },

  /**
   * GET /events/new - Yeni etkinlik formu
   */
  newEventForm: async (req, res) => {
    try {
      const users = await userModel.getAll();
      res.render('events/new', {
        title: 'Yeni Etkinlik Oluştur',
        users,
        formData: {},
        errorMessage: null
      });
    } catch (error) {
      console.error('Etkinlik form hatası:', error);
      res.status(500).render('error', {
        title: 'Hata',
        message: 'Form açılamadı.'
      });
    }
  },

  /**
   * POST /events - Yeni etkinlik kaydetme
   */
  createEvent: async (req, res) => {
    try {
      const { title, description, event_date, location, capacity, created_by } = req.body;

      if (!title || !event_date) {
        const users = await userModel.getAll();
        return res.status(400).render('events/new', {
          title: 'Yeni Etkinlik Oluştur',
          users,
          formData: req.body,
          errorMessage: 'Etkinlik başlığı ve tarihi zorunludur.'
        });
      }

      await eventModel.create({
        title,
        description,
        event_date,
        location,
        capacity: capacity ? parseInt(capacity, 10) : 100,
        created_by: created_by ? parseInt(created_by, 10) : null
      });

      res.redirect('/events?success=' + encodeURIComponent('Etkinlik başarıyla oluşturuldu.'));
    } catch (error) {
      console.error('Etkinlik oluşturma hatası:', error);
      const users = await userModel.getAll().catch(() => []);
      res.status(500).render('events/new', {
        title: 'Yeni Etkinlik Oluştur',
        users,
        formData: req.body,
        errorMessage: error.message || 'Etkinlik oluşturulamadı.'
      });
    }
  },

  /**
   * GET /events/:id - Etkinlik detay sayfası
   */
  showEvent: async (req, res) => {
    try {
      const evt = await eventModel.getById(req.params.id);
      if (!evt) {
        return res.status(404).render('error', {
          title: 'Etkinlik Bulunamadı',
          message: `ID #${req.params.id} numaralı etkinlik bulunamadı.`
        });
      }

      const creator = await eventModel.getCreator(evt.id);
      const participants = await eventModel.getParticipants(evt.id);
      const allUsers = await userModel.getAll();

      res.render('events/show', {
        title: `${evt.title} | Etkinlik Detayı`,
        event: evt,
        creator,
        participants,
        allUsers,
        successMessage: req.query.success || null,
        errorMessage: req.query.error || null
      });
    } catch (error) {
      console.error('Etkinlik detay hatası:', error);
      res.status(500).render('error', {
        title: 'Hata',
        message: 'Etkinlik detayları yüklenemedi.'
      });
    }
  },

  /**
   * GET /events/:id/edit - Etkinlik düzenleme formu
   */
  editEventForm: async (req, res) => {
    try {
      const evt = await eventModel.getById(req.params.id);
      if (!evt) {
        return res.status(404).render('error', {
          title: 'Etkinlik Bulunamadı',
          message: `ID #${req.params.id} numaralı etkinlik bulunamadı.`
        });
      }

      const users = await userModel.getAll();
      res.render('events/edit', {
        title: `Etkinliği Düzenle: ${evt.title}`,
        event: evt,
        users,
        errorMessage: null
      });
    } catch (error) {
      console.error('Etkinlik düzenleme hatası:', error);
      res.status(500).render('error', {
        title: 'Hata',
        message: 'Düzenleme sayfası açılamadı.'
      });
    }
  },

  /**
   * POST /events/:id - Etkinlik güncelleme
   */
  updateEvent: async (req, res) => {
    try {
      const existing = await eventModel.getById(req.params.id);
      if (!existing) {
        return res.status(404).render('error', {
          title: 'Etkinlik Bulunamadı',
          message: `ID #${req.params.id} numaralı etkinlik bulunamadı.`
        });
      }

      await eventModel.update(req.params.id, {
        ...req.body,
        capacity: req.body.capacity ? parseInt(req.body.capacity, 10) : existing.capacity
      });

      res.redirect(`/events/${req.params.id}?success=` + encodeURIComponent('Etkinlik güncellendi.'));
    } catch (error) {
      console.error('Etkinlik güncelleme hatası:', error);
      const users = await userModel.getAll().catch(() => []);
      res.status(500).render('events/edit', {
        title: 'Etkinliği Düzenle',
        event: { ...req.body, id: req.params.id },
        users,
        errorMessage: error.message || 'Güncellenemedi.'
      });
    }
  },

  /**
   * POST /events/:id/delete - Etkinlik silme
   */
  deleteEvent: async (req, res) => {
    try {
      await eventModel.delete(req.params.id);
      res.redirect('/events?success=' + encodeURIComponent('Etkinlik silindi.'));
    } catch (error) {
      console.error('Etkinlik silme hatası:', error);
      res.redirect(`/events/${req.params.id}?error=` + encodeURIComponent('Etkinlik silinemedi.'));
    }
  },

  /**
   * POST /events/:id/register - Etkinliğe kayıt olma (N:M form submit)
   */
  registerAttendee: async (req, res) => {
    try {
      const { user_id } = req.body;
      const eventId = req.params.id;

      if (!user_id) {
        return res.redirect(`/events/${eventId}?error=` + encodeURIComponent('Lütfen kullanıcı seçiniz.'));
      }

      await eventAttendeeModel.register(eventId, user_id);
      res.redirect(`/events/${eventId}?success=` + encodeURIComponent('Etkinliğe başarıyla kayıt oldunuz!'));
    } catch (error) {
      console.error('Web Etkinlik kayıt hatası:', error);
      res.redirect(`/events/${req.params.id}?error=` + encodeURIComponent(error.message || 'Kayıt yapılamadı.'));
    }
  }
};

export default EventController;
