/**
 * @file src/controllers/jobController.js
 * @description Web View Katmanı İş ve Staj İlanı Kontrolcüsü (JobController - MVC View)
 * @author Rumeysa Aydın
 */

import { jobPostingModel, applicationModel, userModel } from '../models/index.js';

export const JobController = {
  /**
   * GET /jobs - İlan listeleme sayfası
   */
  listJobs: async (req, res) => {
    try {
      const search = req.query.search || req.query.q || '';
      const type = req.query.type || '';
      const work_model = req.query.work_model || '';
      const experience_level = req.query.experience_level || '';

      const jobs = await jobPostingModel.getAll({
        search,
        type,
        work_model,
        experience_level
      });

      const enrichedJobs = await Promise.all(
        jobs.map(async (job) => {
          const applications = await applicationModel.getByJobId(job.id);
          return {
            ...job,
            applicationsCount: applications.length
          };
        })
      );

      res.render('jobs/index', {
        title: 'İş ve Staj İlanları',
        jobs: enrichedJobs,
        filters: { search, type, work_model, experience_level },
        successMessage: req.query.success || null,
        errorMessage: req.query.error || null
      });
    } catch (error) {
      console.error('İlan listesi render hatası:', error);
      res.status(500).render('error', {
        title: 'Hata',
        message: 'İş ilanları listelenirken bir hata oluştu.'
      });
    }
  },

  /**
   * GET /jobs/new - Yeni ilan ekleme formu
   */
  newJobForm: async (req, res) => {
    try {
      const users = await userModel.getAll();
      res.render('jobs/new', {
        title: 'Yeni İş / Staj İlanı Yayınla',
        users,
        formData: {},
        errorMessage: null
      });
    } catch (error) {
      console.error('İlan ekleme formu hatası:', error);
      res.status(500).render('error', {
        title: 'Hata',
        message: 'Form yüklenirken hata oluştu.'
      });
    }
  },

  /**
   * POST /jobs - Yeni ilanı kaydetme
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
        posted_by
      } = req.body;

      if (!title || !company || !description) {
        const users = await userModel.getAll();
        return res.status(400).render('jobs/new', {
          title: 'Yeni İş / Staj İlanı Yayınla',
          users,
          formData: req.body,
          errorMessage: 'Başlık, şirket adı ve açıklama alanları zorunludur.'
        });
      }

      await jobPostingModel.create({
        title,
        company,
        description,
        requirements,
        location,
        work_model,
        type,
        experience_level,
        sector,
        salary_min: salary_min ? parseFloat(salary_min) : null,
        salary_max: salary_max ? parseFloat(salary_max) : null,
        currency: currency || 'TRY',
        application_url,
        contact_email,
        deadline,
        posted_by: posted_by ? parseInt(posted_by, 10) : null
      });

      res.redirect('/jobs?success=' + encodeURIComponent('İş ilanı başarıyla yayınlandı.'));
    } catch (error) {
      console.error('İlan kayıt hatası:', error);
      const users = await userModel.getAll().catch(() => []);
      res.status(500).render('jobs/new', {
        title: 'Yeni İş / Staj İlanı Yayınla',
        users,
        formData: req.body,
        errorMessage: error.message || 'İlan kaydedilemedi.'
      });
    }
  },

  /**
   * GET /jobs/:id - İlan detay sayfası
   */
  showJob: async (req, res) => {
    try {
      const job = await jobPostingModel.getById(req.params.id);
      if (!job) {
        return res.status(404).render('error', {
          title: 'İlan Bulunamadı',
          message: `ID #${req.params.id} numaralı ilan bulunamadı.`
        });
      }

      await jobPostingModel.incrementViewCount(job.id);
      const poster = await jobPostingModel.getPoster(job.id);
      const applicants = await jobPostingModel.getApplicants(job.id);
      const allUsers = await userModel.getAll();

      res.render('jobs/show', {
        title: `${job.title} | ${job.company}`,
        job: { ...job, view_count: (job.view_count || 0) + 1 },
        poster,
        applicants,
        allUsers,
        successMessage: req.query.success || null,
        errorMessage: req.query.error || null
      });
    } catch (error) {
      console.error('İlan detay render hatası:', error);
      res.status(500).render('error', {
        title: 'Hata',
        message: 'İlan detayları yüklenemedi.'
      });
    }
  },

  /**
   * GET /jobs/:id/edit - İlan düzenleme formu
   */
  editJobForm: async (req, res) => {
    try {
      const job = await jobPostingModel.getById(req.params.id);
      if (!job) {
        return res.status(404).render('error', {
          title: 'İlan Bulunamadı',
          message: `ID #${req.params.id} numaralı ilan bulunamadı.`
        });
      }

      const users = await userModel.getAll();
      res.render('jobs/edit', {
        title: `İlanı Düzenle: ${job.title}`,
        job,
        users,
        errorMessage: null
      });
    } catch (error) {
      console.error('İlan düzenleme form hatası:', error);
      res.status(500).render('error', {
        title: 'Hata',
        message: 'İlan düzenleme sayfası yüklenemedi.'
      });
    }
  },

  /**
   * POST /jobs/:id - İlan güncelleme
   */
  updateJob: async (req, res) => {
    try {
      const existing = await jobPostingModel.getById(req.params.id);
      if (!existing) {
        return res.status(404).render('error', {
          title: 'İlan Bulunamadı',
          message: `ID #${req.params.id} numaralı ilan bulunamadı.`
        });
      }

      await jobPostingModel.update(req.params.id, {
        ...req.body,
        salary_min: req.body.salary_min ? parseFloat(req.body.salary_min) : null,
        salary_max: req.body.salary_max ? parseFloat(req.body.salary_max) : null,
        posted_by: req.body.posted_by ? parseInt(req.body.posted_by, 10) : null
      });

      res.redirect(`/jobs/${req.params.id}?success=` + encodeURIComponent('İlan bilgileri güncellendi.'));
    } catch (error) {
      console.error('İlan güncelleme hatası:', error);
      const users = await userModel.getAll().catch(() => []);
      res.status(500).render('jobs/edit', {
        title: 'İlanı Düzenle',
        job: { ...req.body, id: req.params.id },
        users,
        errorMessage: error.message || 'İlan güncellenemedi.'
      });
    }
  },

  /**
   * POST /jobs/:id/delete - İlan silme
   */
  deleteJob: async (req, res) => {
    try {
      await jobPostingModel.delete(req.params.id);
      res.redirect('/jobs?success=' + encodeURIComponent('İş ilanı sistemden silindi.'));
    } catch (error) {
      console.error('İlan silme hatası:', error);
      res.redirect(`/jobs/${req.params.id}?error=` + encodeURIComponent('İlan silinemedi.'));
    }
  },

  /**
   * POST /jobs/:id/apply - İlana başvuru formu gönderimi
   */
  applyToJob: async (req, res) => {
    try {
      const { user_id, cover_letter, resume_url, portfolio_url, expected_salary } = req.body;
      const jobId = req.params.id;

      if (!user_id) {
        return res.redirect(`/jobs/${jobId}?error=` + encodeURIComponent('Lütfen başvuran kullanıcı seçiniz.'));
      }

      await applicationModel.apply({
        job_id: jobId,
        user_id,
        cover_letter,
        resume_url,
        portfolio_url,
        expected_salary
      });

      res.redirect(`/jobs/${jobId}?success=` + encodeURIComponent('Başvurunuz başarıyla kaydedildi!'));
    } catch (error) {
      console.error('Web İlan başvuru hatası:', error);
      res.redirect(`/jobs/${req.params.id}?error=` + encodeURIComponent(error.message || 'Başvuru yapılamadı.'));
    }
  }
};

export default JobController;
