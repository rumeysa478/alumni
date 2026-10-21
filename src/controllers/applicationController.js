/**
 * @file src/controllers/applicationController.js
 * @description Web View Katmanı İş ve Staj Başvuruları Kontrolcüsü (ApplicationController - MVC View)
 * @author Rumeysa Aydın
 */

import { applicationModel, jobPostingModel, userModel, VALID_STATUSES, APPLICATION_STATUS } from '../models/index.js';

export const ApplicationController = {
  /**
   * GET /applications - Başvuru listeleme sayfası
   */
  listApplications: async (req, res) => {
    try {
      const status = req.query.status || '';
      const job_id = req.query.job_id || '';
      const user_id = req.query.user_id || '';

      const filters = {};
      if (status) filters.status = status;
      if (job_id) filters.job_id = job_id;
      if (user_id) filters.user_id = user_id;

      const rawApps = await applicationModel.getAll(filters);
      const [allJobs, allUsers] = await Promise.all([
        jobPostingModel.getAll(),
        userModel.getAll()
      ]);

      const jobMap = new Map(allJobs.map(j => [j.id, j]));
      const userMap = new Map(allUsers.map(u => [u.id, u]));

      const applications = rawApps.map(app => ({
        ...app,
        job: jobMap.get(app.job_id) || { id: app.job_id, title: 'Bilinmeyen İlan', company: 'Bilinmeyen Şirket' },
        applicant: userMap.get(app.user_id) || { id: app.user_id, first_name: 'Bilinmeyen', last_name: 'Kullanıcı', email: '-' }
      }));

      res.render('applications/index', {
        title: 'İş ve Staj Başvuruları',
        applications,
        jobs: allJobs,
        users: allUsers,
        statuses: VALID_STATUSES,
        filters: { status, job_id, user_id },
        successMessage: req.query.success || null,
        errorMessage: req.query.error || null
      });
    } catch (error) {
      console.error('Başvuru listesi render hatası:', error);
      res.status(500).render('error', {
        title: 'Hata',
        message: 'Başvurular listelenirken bir hata oluştu.'
      });
    }
  },

  /**
   * GET /applications/new - Yeni başvuru yapma formu
   */
  newApplicationForm: async (req, res) => {
    try {
      const selectedJobId = req.query.job_id ? parseInt(req.query.job_id, 10) : null;
      const [jobs, users] = await Promise.all([
        jobPostingModel.getAll({ is_active: true }),
        userModel.getAll()
      ]);

      res.render('applications/new', {
        title: 'Yeni Başvuru Yap',
        jobs,
        users,
        selectedJobId,
        formData: { job_id: selectedJobId || '' },
        errorMessage: null
      });
    } catch (error) {
      console.error('Başvuru formu açma hatası:', error);
      res.status(500).render('error', {
        title: 'Hata',
        message: 'Başvuru formu yüklenemedi.'
      });
    }
  },

  /**
   * POST /applications - Yeni başvuruyu kaydetme
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
        const [jobs, users] = await Promise.all([
          jobPostingModel.getAll(),
          userModel.getAll()
        ]);

        return res.status(400).render('applications/new', {
          title: 'Yeni Başvuru Yap',
          jobs,
          users,
          selectedJobId: job_id,
          formData: req.body,
          errorMessage: 'Lütfen başvurulacak ilanı ve aday kullanıcıyı seçiniz.'
        });
      }

      const newApp = await applicationModel.apply({
        job_id,
        user_id,
        cover_letter,
        resume_url,
        portfolio_url,
        expected_salary,
        notes
      });

      console.log(`[MVC VIEW] Yeni başvuru yapıldı: ID=${newApp.id}`);
      res.redirect(`/applications/${newApp.id}?success=Başvurunuz başarıyla kaydedildi!`);
    } catch (error) {
      console.error('Başvuru kaydetme hatası:', error);
      const [jobs, users] = await Promise.all([
        jobPostingModel.getAll(),
        userModel.getAll()
      ]);

      res.status(400).render('applications/new', {
        title: 'Yeni Başvuru Yap',
        jobs,
        users,
        selectedJobId: req.body.job_id,
        formData: req.body,
        errorMessage: error.message || 'Başvuru kaydedilirken bir hata oluştu.'
      });
    }
  },

  /**
   * GET /applications/:id - Başvuru detay sayfası
   */
  showApplication: async (req, res) => {
    try {
      const { id } = req.params;
      const application = await applicationModel.getById(id);

      if (!application) {
        return res.status(404).render('error', {
          title: 'Başvuru Bulunamadı',
          message: `ID=${id} olan başvuru bulunamadı.`
        });
      }

      const [job, applicant] = await Promise.all([
        jobPostingModel.getById(application.job_id),
        userModel.getById(application.user_id)
      ]);

      res.render('applications/show', {
        title: `Başvuru #${application.id} Detayı`,
        application,
        job,
        applicant,
        statuses: VALID_STATUSES,
        successMessage: req.query.success || null,
        errorMessage: req.query.error || null
      });
    } catch (error) {
      console.error('Başvuru detay render hatası:', error);
      res.status(500).render('error', {
        title: 'Hata',
        message: 'Başvuru detayı getirilemedi.'
      });
    }
  },

  /**
   * POST /applications/:id/status - Durum güncelleme formu submit
   */
  updateStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, notes, rejection_reason } = req.body;

      await applicationModel.updateStatus(id, status, notes, rejection_reason);
      res.redirect(`/applications/${id}?success=Başvuru durumu başarıyla '${status}' olarak güncellendi.`);
    } catch (error) {
      console.error('Başvuru durum güncelleme hatası:', error);
      res.redirect(`/applications/${req.params.id}?error=${encodeURIComponent(error.message)}`);
    }
  },

  /**
   * POST /applications/:id/withdraw - Başvuruyu geri çekme
   */
  withdrawApplication: async (req, res) => {
    try {
      const { id } = req.params;
      await applicationModel.withdraw(id);
      res.redirect(`/applications/${id}?success=Başvurunuz başarıyla geri çekildi.`);
    } catch (error) {
      console.error('Başvuru geri çekme hatası:', error);
      res.redirect(`/applications/${req.params.id}?error=${encodeURIComponent(error.message)}`);
    }
  },

  /**
   * POST /applications/:id/delete - Başvuruyu silme
   */
  deleteApplication: async (req, res) => {
    try {
      const { id } = req.params;
      await applicationModel.delete(id);
      res.redirect('/applications?success=Başvuru kaydı başarıyla silindi.');
    } catch (error) {
      console.error('Başvuru silme hatası:', error);
      res.redirect(`/applications/${req.params.id}?error=${encodeURIComponent(error.message)}`);
    }
  }
};

export default ApplicationController;
