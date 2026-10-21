/**
 * @file src/controllers/apiApplicationController.js
 * @description REST API İş ve Staj Başvuruları Aksiyon Kontrolcüsü (/api/applications)
 * Users ve JobPostings arasındaki N:M ilişki aksiyonlarını yönetir.
 * @author Rumeysa Aydın
 */

import { applicationModel, jobPostingModel, userModel, VALID_STATUSES } from '../models/index.js';

export const ApiApplicationController = {
  /**
   * GET /api/applications
   * Başvuruları filtreleme ve listeleme
   */
  getApplications: async (req, res) => {
    try {
      const { job_id, user_id, status } = req.query;
      const filters = {};

      if (job_id) filters.job_id = job_id;
      if (user_id) filters.user_id = user_id;
      if (status) filters.status = status;

      const rawApplications = await applicationModel.getAll(filters);

      // İlişkili ilan ve kullanıcı bilgilerini zenginleştir
      const applications = await Promise.all(
        rawApplications.map(async (app) => {
          const [job, user] = await Promise.all([
            jobPostingModel.getById(app.job_id),
            userModel.getById(app.user_id)
          ]);

          return {
            ...app,
            job: job ? {
              id: job.id,
              title: job.title,
              company: job.company,
              work_model: job.work_model,
              type: job.type
            } : null,
            applicant: user ? {
              id: user.id,
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
              role: user.role,
              department: user.department
            } : null
          };
        })
      );

      res.status(200).json({
        success: true,
        count: applications.length,
        data: applications
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Başvurular listelenirken sunucu hatası oluştu.',
        error: err.message
      });
    }
  },

  /**
   * GET /api/applications/:id
   * Tekil başvuru detayı
   */
  getApplicationById: async (req, res) => {
    try {
      const { id } = req.params;
      const application = await applicationModel.getById(id);

      if (!application) {
        return res.status(404).json({
          success: false,
          message: `ID=${id} olan başvuru bulunamadı.`
        });
      }

      const [job, user] = await Promise.all([
        jobPostingModel.getById(application.job_id),
        userModel.getById(application.user_id)
      ]);

      res.status(200).json({
        success: true,
        data: {
          ...application,
          job: job || null,
          applicant: user ? {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role,
            department: user.department,
            graduation_year: user.graduation_year
          } : null
        }
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Başvuru detayı getirilirken hata oluştu.',
        error: err.message
      });
    }
  },

  /**
   * POST /api/applications
   * Doğrudan başvuru oluşturma
   */
  createApplication: async (req, res) => {
    try {
      const {
        job_id,
        user_id,
        cover_letter,
        resume_url,
        portfolio_url,
        expected_salary,
        notes
      } = req.body;

      if (!job_id || !user_id) {
        return res.status(400).json({
          success: false,
          message: 'job_id ve user_id zorunlu alanlardır.'
        });
      }

      // Varlıkların mevcudiyetini kontrol et
      const [job, user] = await Promise.all([
        jobPostingModel.getById(job_id),
        userModel.getById(user_id)
      ]);

      if (!job) {
        return res.status(404).json({
          success: false,
          message: `ID=${job_id} olan iş ilanı bulunamadı.`
        });
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: `ID=${user_id} olan kullanıcı bulunamadı.`
        });
      }

      const newApplication = await applicationModel.apply({
        job_id,
        user_id,
        cover_letter,
        resume_url,
        portfolio_url,
        expected_salary,
        notes
      });

      console.log(`[REST API] Yeni başvuru yapıldı: ID=${newApplication.id}, JobID=${job_id}, UserID=${user_id}`);

      res.status(201).json({
        success: true,
        message: 'Başvurunuz başarıyla iletildi.',
        data: newApplication
      });
    } catch (err) {
      if (err.code === 409 || err.message?.includes('zaten başvuruda')) {
        return res.status(409).json({
          success: false,
          message: 'Bu ilana zaten aktif bir başvurunuz bulunmaktadır.'
        });
      }

      res.status(400).json({
        success: false,
        message: err.message || 'Başvuru oluşturulamadı.'
      });
    }
  },

  /**
   * PUT /api/applications/:id
   * Başvuru bilgilerini güncelleme
   */
  updateApplication: async (req, res) => {
    try {
      const { id } = req.params;
      const existing = await applicationModel.getById(id);

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: `ID=${id} olan başvuru bulunamadı.`
        });
      }

      const updated = await applicationModel.update(id, req.body);

      res.status(200).json({
        success: true,
        message: 'Başvuru başarıyla güncellendi.',
        data: updated
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message || 'Başvuru güncellenirken hata oluştu.'
      });
    }
  },

  /**
   * PUT /api/applications/:id/status veya PATCH /api/applications/:id/status
   * Başvuru durumunu ve değerlendirme notlarını güncelleme
   */
  updateStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, notes, rejection_reason } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: `status alanı zorunludur. Geçerli değerler: ${VALID_STATUSES.join(', ')}`
        });
      }

      const existing = await applicationModel.getById(id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: `ID=${id} olan başvuru bulunamadı.`
        });
      }

      const updated = await applicationModel.updateStatus(id, status, notes, rejection_reason);

      res.status(200).json({
        success: true,
        message: `Başvuru durumu '${updated.status}' olarak güncellendi.`,
        data: updated
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message || 'Durum güncellenemedi.'
      });
    }
  },

  /**
   * POST /api/applications/:id/withdraw
   * Başvuruyu aday tarafından geri çekme
   */
  withdrawApplication: async (req, res) => {
    try {
      const { id } = req.params;
      const { user_id } = req.body;

      const existing = await applicationModel.getById(id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: `ID=${id} olan başvuru bulunamadı.`
        });
      }

      const withdrawn = await applicationModel.withdraw(id, user_id);

      res.status(200).json({
        success: true,
        message: 'Başvurunuz başarıyla geri çekildi.',
        data: withdrawn
      });
    } catch (err) {
      res.status(err.code || 400).json({
        success: false,
        message: err.message || 'Başvuru geri çekilemedi.'
      });
    }
  },

  /**
   * DELETE /api/applications/:id
   * Başvuruyu sistemden kaldırma
   */
  deleteApplication: async (req, res) => {
    try {
      const { id } = req.params;
      const existing = await applicationModel.getById(id);

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: `ID=${id} olan başvuru bulunamadı.`
        });
      }

      await applicationModel.delete(id);

      res.status(200).json({
        success: true,
        message: `ID=${id} olan başvuru kaydı başarıyla silindi.`
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Başvuru silinirken sunucu hatası oluştu.',
        error: err.message
      });
    }
  }
};

export default ApiApplicationController;
