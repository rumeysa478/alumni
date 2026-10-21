/**
 * @file src/routes/apiJob.routes.js
 * @description REST API İş ve Staj İlanı Rotaları (/api/jobs)
 * @author Rumeysa Aydın
 */

import { Router } from 'express';
import ApiJobController from '../controllers/apiJobController.js';

const router = Router();

// GET /api/jobs - İlanları filtreleme ve listeleme
router.get('/', ApiJobController.getJobs);

// POST /api/jobs - Yeni iş/staj ilanı oluşturma
router.post('/', ApiJobController.createJob);

// GET /api/jobs/:id - Tekil ilan detayları
router.get('/:id', ApiJobController.getJobById);

// PUT /api/jobs/:id - İlan güncelleme
router.put('/:id', ApiJobController.updateJob);

// DELETE /api/jobs/:id - İlan silme
router.delete('/:id', ApiJobController.deleteJob);

// POST /api/jobs/:id/apply - İlana başvuru yapma (N:M relation)
router.post('/:id/apply', ApiJobController.applyToJob);

// GET /api/jobs/:id/applications - İlana gelen başvuruları görme
router.get('/:id/applications', ApiJobController.getJobApplications);

export default router;
