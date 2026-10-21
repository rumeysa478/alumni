/**
 * @file src/routes/application.routes.js
 * @description Web View Katmanı İş ve Staj Başvuruları Rotaları (/applications)
 * @author Rumeysa Aydın
 */

import { Router } from 'express';
import ApplicationController from '../controllers/applicationController.js';

const router = Router();

// GET /applications - Başvuru listesi ve filtreleme
router.get('/', ApplicationController.listApplications);

// GET /applications/new - Yeni başvuru formu
router.get('/new', ApplicationController.newApplicationForm);

// POST /applications - Yeni başvuru kaydetme
router.post('/', ApplicationController.createApplication);

// GET /applications/:id - Başvuru detayı
router.get('/:id', ApplicationController.showApplication);

// POST /applications/:id/status - Başvuru durumunu ve notunu güncelleme
router.post('/:id/status', ApplicationController.updateStatus);

// POST /applications/:id/withdraw - Başvuruyu geri çekme
router.post('/:id/withdraw', ApplicationController.withdrawApplication);

// POST /applications/:id/delete - Başvuruyu silme
router.post('/:id/delete', ApplicationController.deleteApplication);

export default router;
