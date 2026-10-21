/**
 * @file src/controllers/apiEventController.js
 * @description REST API Etkinlik Kontrolcüsü (ApiEventController)
 * @author Rumeysa Aydın
 */

import { eventModel, eventAttendeeModel, userModel } from '../models/index.js';

export const ApiEventController = {
  /**
   * GET /api/events - Etkinlikleri listeleme
   */
  getEvents: async (req, res) => {
    try {
      const search = req.query.search || req.query.q;
      const created_by = req.query.created_by;

      const events = await eventModel.getAll({ search, created_by });

      return res.status(200).json({
        success: true,
        count: events.length,
        data: events
      });
    } catch (error) {
      console.error('API Etkinlik listesi hatası:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Etkinlikler listelenirken bir hata oluştu.'
      });
    }
  },

  /**
   * GET /api/events/:id - Tekil etkinlik detayı
   */
  getEventById: async (req, res) => {
    try {
      const evt = await eventModel.getById(req.params.id);
      if (!evt) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: `ID #${req.params.id} numaralı etkinlik bulunamadı.`
        });
      }

      const creator = await eventModel.getCreator(evt.id);
      const attendees = await eventModel.getAttendees(evt.id);

      return res.status(200).json({
        success: true,
        data: {
          ...evt,
          attendee_count: attendees.length,
          creator: creator ? {
            id: creator.id,
            first_name: creator.first_name,
            last_name: creator.last_name,
            email: creator.email
          } : null
        }
      });
    } catch (error) {
      console.error('API Etkinlik detay hatası:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Etkinlik detayları alınamadı.'
      });
    }
  },

  /**
   * POST /api/events - Yeni etkinlik oluşturma
   */
  createEvent: async (req, res) => {
    try {
      const { title, description, event_date, location, capacity, created_by } = req.body;

      if (!title || !event_date) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: 'title ve event_date alanları zorunludur.'
        });
      }

      const newEvent = await eventModel.create({
        title,
        description,
        event_date,
        location,
        capacity,
        created_by
      });

      return res.status(201).json({
        success: true,
        message: 'Etkinlik başarıyla oluşturuldu.',
        data: newEvent
      });
    } catch (error) {
      console.error('API Etkinlik oluşturma hatası:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error.message || 'Etkinlik oluşturulamadı.'
      });
    }
  },

  /**
   * PUT /api/events/:id - Etkinlik güncelleme
   */
  updateEvent: async (req, res) => {
    try {
      const existing = await eventModel.getById(req.params.id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: `ID #${req.params.id} numaralı etkinlik bulunamadı.`
        });
      }

      const updated = await eventModel.update(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Etkinlik başarıyla güncellendi.',
        data: updated
      });
    } catch (error) {
      console.error('API Etkinlik güncelleme hatası:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error.message || 'Etkinlik güncellenemedi.'
      });
    }
  },

  /**
   * DELETE /api/events/:id - Etkinlik silme
   */
  deleteEvent: async (req, res) => {
    try {
      const existing = await eventModel.getById(req.params.id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: `ID #${req.params.id} numaralı etkinlik bulunamadı.`
        });
      }

      await eventModel.delete(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Etkinlik başarıyla silindi.',
        data: existing
      });
    } catch (error) {
      console.error('API Etkinlik silme hatası:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Etkinlik silinemedi.'
      });
    }
  },

  /**
   * POST /api/events/:id/register - Etkinliğe kayıt olma (N:M İlişki)
   */
  registerAttendee: async (req, res) => {
    try {
      const eventId = req.params.id;
      const { user_id } = req.body;

      if (!user_id) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: 'user_id zorunludur.'
        });
      }

      const evt = await eventModel.getById(eventId);
      if (!evt) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: 'Kayıt olunmak istenen etkinlik bulunamadı.'
        });
      }

      const user = await userModel.getById(user_id);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: 'Kullanıcı bulunamadı.'
        });
      }

      const attendee = await eventAttendeeModel.register(eventId, user_id);
      return res.status(201).json({
        success: true,
        message: 'Etkinliğe kaydınız başarıyla oluşturuldu.',
        data: attendee
      });
    } catch (error) {
      if (error.code === 409) {
        return res.status(409).json({
          success: false,
          error: 'Conflict',
          message: error.message
        });
      }
      console.error('API Etkinlik kayıt hatası:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error.message || 'Kayıt gerçekleştirilemedi.'
      });
    }
  },

  /**
   * GET /api/events/:id/attendees - Etkinlik katılımcılarını listeleme
   */
  getEventAttendees: async (req, res) => {
    try {
      const eventId = req.params.id;
      const evt = await eventModel.getById(eventId);
      if (!evt) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: 'Etkinlik bulunamadı.'
        });
      }

      const participants = await eventModel.getParticipants(eventId);
      return res.status(200).json({
        success: true,
        count: participants.length,
        data: participants
      });
    } catch (error) {
      console.error('API Katılımcı listesi hatası:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Katılımcılar alınamadı.'
      });
    }
  }
};

export default ApiEventController;
