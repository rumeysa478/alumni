/**
 * @file src/routes/apiAnnouncement.routes.js
 * @description REST API Duyuru Rotaları (ApiAnnouncementController ile eşleşen JSON API rotaları)
 */

import { Router } from 'express';
import multer from 'multer';
import ApiAnnouncementController from '../controllers/apiAnnouncementController.js';

const upload = multer();
const router = Router();

// GET /api/announcements - Tüm duyuruları JSON formatında listeleme (Read)
router.get('/', ApiAnnouncementController.getAnnouncements);

// POST /api/announcements - Yeni duyuru oluşturma (Create - JSON, Form-data, URL-encoded)
router.post('/', upload.none(), ApiAnnouncementController.createAnnouncement);

// GET /api/announcements/:id - ID ile tekil duyuru getirme (Read)
router.get('/:id', ApiAnnouncementController.getAnnouncementById);

// PUT /api/announcements/:id - Duyuruyu tam güncelleme (Update)
router.put('/:id', upload.none(), ApiAnnouncementController.updateAnnouncement);

// PATCH /api/announcements/:id - Duyuruyu kısmi güncelleme (Update)
router.patch('/:id', upload.none(), ApiAnnouncementController.patchAnnouncement);

// DELETE /api/announcements/:id - Duyuruyu silme (Delete)
router.delete('/:id', ApiAnnouncementController.deleteAnnouncement);

export default router;
