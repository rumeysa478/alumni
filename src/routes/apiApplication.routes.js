/**
 * @file src/routes/apiApplication.routes.js
 * @description REST API İş ve Staj Başvuruları Rotaları (/api/applications)
 * @author Rumeysa Aydın
 */

import { Router } from 'express';
import ApiApplicationController from '../controllers/apiApplicationController.js';

const router = Router();

// GET /api/applications - Başvuruları listeleme ve filtreleme (?job_id=&user_id=&status=)
router.get('/', ApiApplicationController.getApplications);

// POST /api/applications - Yeni başvuru yapma (Direct Action)
router.post('/', ApiApplicationController.createApplication);

// GET /api/applications/:id - Tekil başvuru detayı
router.get('/:id', ApiApplicationController.getApplicationById);

// PUT /api/applications/:id - Başvuru bilgilerini tam/kısmi güncelleme
router.put('/:id', ApiApplicationController.updateApplication);

// PUT /api/applications/:id/status & PATCH /api/applications/:id/status - Durum güncelleme
router.put('/:id/status', ApiApplicationController.updateStatus);
router.patch('/:id/status', ApiApplicationController.updateStatus);

// POST /api/applications/:id/withdraw - Başvuruyu geri çekme
router.post('/:id/withdraw', ApiApplicationController.withdrawApplication);

// DELETE /api/applications/:id - Başvuru silme
router.delete('/:id', ApiApplicationController.deleteApplication);

export default router;
