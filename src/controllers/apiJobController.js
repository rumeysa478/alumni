/**
 * @file src/controllers/apiJobController.js
 * @description REST API İş ve Staj İlanı Kontrolcüsü (ApiJobController)
 * @author Rumeysa Aydın
 */

import { jobPostingModel, jobApplicationModel, userModel } from '../models/index.js';

export const ApiJobController = {
  /**
   * GET /api/jobs - İlanları filtreleyerek listeleme
   */
  getJobs: async (req, res) => {
    try {
      const search = req.query.search || req.query.q;
      const type = req.query.type;
      const work_model = req.query.work_model || req.query.workModel;
      const experience_level = req.query.experience_level || req.query.experienceLevel;
      const is_active = req.query.is_active;

      const jobs = await jobPostingModel.getAll({
        search,
        type,
        work_model,
        experience_level,
        is_active
      });

      return res.status(200).json({
        success: true,
        count: jobs.length,
        data: jobs
      });
    } catch (error) {
      console.error('API İlan listesi hatası:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'İlanlar listelenirken bir hata oluştu.'
      });
    }
  },

  /**
   * GET /api/jobs/:id - Tekil ilan detayları
   */
  getJobById: async (req, res) => {
    try {
      const job = await jobPostingModel.getById(req.params.id);
      if (!job) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: `ID #${req.params.id} numaralı iş ilanı bulunamadı.`
        });
      }

      await jobPostingModel.incrementViewCount(job.id);
      const poster = await jobPostingModel.getPoster(job.id);

      return res.status(200).json({
        success: true,
        data: {
          ...job,
          view_count: (job.view_count || 0) + 1,
          poster: poster ? {
            id: poster.id,
            first_name: poster.first_name,
            last_name: poster.last_name,
            email: poster.email
          } : null
        }
      });
    } catch (error) {
      console.error('API İlan detay hatası:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'İlan detayları alınırken bir hata oluştu.'
      });
    }
  },

  /**
   * POST /api/jobs - Yeni ilan oluşturma
   */
  createJob: async (req, res) => {
    try {
      const {
        title,
        company,
        description,
        requirements,
        location,
        work_model,
        type,
        experience_level,
        sector,
        salary_min,
        salary_max,
        currency,
        application_url,
        contact_email,
        deadline,
        posted_by,
        is_active
      } = req.body;

      if (!title || !company || !description) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: 'title, company ve description alanları zorunludur.'
        });
      }

      const newJob = await jobPostingModel.create({
        title,
        company,
        description,
        requirements,
        location,
        work_model,
        type,
        experience_level,
        sector,
        salary_min,
        salary_max,
        currency,
        application_url,
        contact_email,
        deadline,
        posted_by,
        is_active
      });

      return res.status(201).json({
        success: true,
        message: 'İş ilanı başarıyla yayınlandı.',
        data: newJob
      });
    } catch (error) {
      console.error('API İlan oluşturma hatası:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error.message || 'İlan oluşturulamadı.'
      });
    }
  },

  /**
   * PUT /api/jobs/:id - İlan güncelleme
   */
  updateJob: async (req, res) => {
    try {
      const existing = await jobPostingModel.getById(req.params.id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: `ID #${req.params.id} numaralı iş ilanı bulunamadı.`
        });
      }

      const updated = await jobPostingModel.update(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: 'İş ilanı başarıyla güncellendi.',
        data: updated
      });
    } catch (error) {
      console.error('API İlan güncelleme hatası:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error.message || 'İlan güncellenirken hata oluştu.'
      });
    }
  },

  /**
   * DELETE /api/jobs/:id - İlan silme
   */
  deleteJob: async (req, res) => {
    try {
      const existing = await jobPostingModel.getById(req.params.id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: `ID #${req.params.id} numaralı iş ilanı bulunamadı.`
        });
      }

      await jobPostingModel.delete(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'İş ilanı başarıyla silindi.',
        data: existing
      });
    } catch (error) {
      console.error('API İlan silme hatası:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'İlan silinirken bir hata oluştu.'
      });
    }
  },

  /**
   * POST /api/jobs/:id/apply - İlana başvuru yapma (N:M İlişki)
   */
  applyToJob: async (req, res) => {
    try {
      const jobId = req.params.id;
      const { user_id, cover_letter, resume_url } = req.body;

      if (!user_id) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: 'user_id zorunludur.'
        });
      }

      const job = await jobPostingModel.getById(jobId);
      if (!job) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: 'Başvurulmak istenen iş ilanı bulunamadı.'
        });
      }

      const user = await userModel.getById(user_id);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: 'Başvuran kullanıcı bulunamadı.'
        });
      }

      const application = await jobApplicationModel.apply({
        job_id: jobId,
        user_id,
        cover_letter,
        resume_url
      });

      return res.status(201).json({
        success: true,
        message: 'Başvurunuz başarıyla kaydedildi.',
        data: application
      });
    } catch (error) {
      if (error.code === 409) {
        return res.status(409).json({
          success: false,
          error: 'Conflict',
          message: error.message
        });
      }
      console.error('API İlan başvuru hatası:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error.message || 'Başvuru yapılamadı.'
      });
    }
  },

  /**
   * GET /api/jobs/:id/applications - İlanın başvurularını listeleme
   */
  getJobApplications: async (req, res) => {
    try {
      const jobId = req.params.id;
      const job = await jobPostingModel.getById(jobId);
      if (!job) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: 'İş ilanı bulunamadı.'
        });
      }

      const applicants = await jobPostingModel.getApplicants(jobId);
      return res.status(200).json({
        success: true,
        count: applicants.length,
        data: applicants
      });
    } catch (error) {
      console.error('API İlan başvuruları listeleme hatası:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Başvurular listelenirken hata oluştu.'
      });
    }
  }
};

export default ApiJobController;
