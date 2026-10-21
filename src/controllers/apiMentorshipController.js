/**
 * @file src/controllers/apiMentorshipController.js
 * @description REST API Mentörlük Kontrolcüsü (ApiMentorshipController)
 * @author Rumeysa Aydın
 */

import { mentorshipModel, userModel } from '../models/index.js';

export const ApiMentorshipController = {
  /**
   * GET /api/mentorships - Mentörlük ilişkilerini listeleme
   */
  getMentorships: async (req, res) => {
    try {
      const mentor_id = req.query.mentor_id;
      const mentee_id = req.query.mentee_id;
      const status = req.query.status;

      const list = await mentorshipModel.getAll({ mentor_id, mentee_id, status });
      return res.status(200).json({
        success: true,
        count: list.length,
        data: list
      });
    } catch (error) {
      console.error('API Mentörlük listesi hatası:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Mentörlük ilişkileri listelenemedi.'
      });
    }
  },

  /**
   * GET /api/mentorships/:id - Tekil mentörlük detayı
   */
  getMentorshipById: async (req, res) => {
    try {
      const m = await mentorshipModel.getById(req.params.id);
      if (!m) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: `ID #${req.params.id} numaralı mentörlük eşleşmesi bulunamadı.`
        });
      }

      const mentor = await mentorshipModel.getMentor(m.id);
      const mentee = await mentorshipModel.getMentee(m.id);

      return res.status(200).json({
        success: true,
        data: {
          ...m,
          mentor: mentor ? { id: mentor.id, first_name: mentor.first_name, last_name: mentor.last_name, email: mentor.email } : null,
          mentee: mentee ? { id: mentee.id, first_name: mentee.first_name, last_name: mentee.last_name, email: mentee.email } : null
        }
      });
    } catch (error) {
      console.error('API Mentörlük detay hatası:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Mentörlük detayı alınamadı.'
      });
    }
  },

  /**
   * POST /api/mentorships - Yeni mentörlük talebi oluşturma
   */
  createMentorship: async (req, res) => {
    try {
      const { mentor_id, mentee_id, status = 'REQUESTED', notes } = req.body;

      if (!mentor_id || !mentee_id) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: 'mentor_id ve mentee_id zorunludur.'
        });
      }

      if (parseInt(mentor_id, 10) === parseInt(mentee_id, 10)) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: 'Bir kullanıcı kendi kendisinin mentörü olamaz.'
        });
      }

      const mentor = await userModel.getById(mentor_id);
      const mentee = await userModel.getById(mentee_id);
      if (!mentor || !mentee) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: 'Mentör veya mentee kullanıcı hesabı bulunamadı.'
        });
      }

      const created = await mentorshipModel.create({ mentor_id, mentee_id, status, notes });
      return res.status(201).json({
        success: true,
        message: 'Mentörlük talebi başarıyla oluşturuldu.',
        data: created
      });
    } catch (error) {
      console.error('API Mentörlük oluşturma hatası:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error.message || 'Mentörlük talebi oluşturulamadı.'
      });
    }
  },

  /**
   * PUT /api/mentorships/:id - Durum veya not güncelleme
   */
  updateMentorship: async (req, res) => {
    try {
      const { status, notes } = req.body;
      const existing = await mentorshipModel.getById(req.params.id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: `ID #${req.params.id} numaralı mentörlük eşleşmesi bulunamadı.`
        });
      }

      const updated = await mentorshipModel.updateStatus(req.params.id, status || existing.status, notes);
      return res.status(200).json({
        success: true,
        message: 'Mentörlük durumu başarıyla güncellendi.',
        data: updated
      });
    } catch (error) {
      console.error('API Mentörlük güncelleme hatası:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error.message || 'Güncelleme yapılamadı.'
      });
    }
  },

  /**
   * DELETE /api/mentorships/:id - Mentörlük ilişkisini sonlandırma
   */
  deleteMentorship: async (req, res) => {
    try {
      const existing = await mentorshipModel.getById(req.params.id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: `ID #${req.params.id} numaralı mentörlük eşleşmesi bulunamadı.`
        });
      }

      await mentorshipModel.delete(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Mentörlük eşleşmesi sonlandırıldı.',
        data: existing
      });
    } catch (error) {
      console.error('API Mentörlük silme hatası:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Silme işlemi gerçekleştirilemedi.'
      });
    }
  }
};

export default ApiMentorshipController;
