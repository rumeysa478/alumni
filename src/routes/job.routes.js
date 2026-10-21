/**
 * @file src/routes/job.routes.js
 * @description Web MVC İş ve Staj İlanı Rotaları (/jobs)
 * @author Rumeysa Aydın
 */

import { Router } from 'express';
import JobController from '../controllers/jobController.js';

const router = Router();

// GET /jobs - İlanları listeleme
router.get('/', JobController.listJobs);

// GET /jobs/new - Yeni ilan ekleme formu
router.get('/new', JobController.newJobForm);

// POST /jobs - Yeni ilan oluşturma
router.post('/', JobController.createJob);

// GET /jobs/:id - İlan detayları
router.get('/:id', JobController.showJob);

// GET /jobs/:id/edit - İlan düzenleme formu
router.get('/:id/edit', JobController.editJobForm);

// POST /jobs/:id - İlan güncelleme
router.post('/:id', JobController.updateJob);

// POST /jobs/:id/delete - İlan silme
router.post('/:id/delete', JobController.deleteJob);

// POST /jobs/:id/apply - İlana başvuru yapma
router.post('/:id/apply', JobController.applyToJob);

export default router;
