/**
 * @file src/routes/announcement.routes.js
 * @description Web View Katmanı Duyuru Rotaları (AnnouncementController ile eşleşen MVC rotaları)
 */

import { Router } from 'express';
import AnnouncementController from '../controllers/announcementController.js';

const router = Router();

// GET /announcements - Duyuru listeleme sayfası (Read - Listings)
router.get('/', AnnouncementController.listAnnouncements);

// GET /announcements/new - Yeni duyuru oluşturma formu sayfası
router.get('/new', AnnouncementController.renderCreateForm);

// POST /announcements - Yeni duyuru ekleme form gönderimi (Create - C)
router.post('/', AnnouncementController.createAnnouncement);

// GET /announcements/:id - Tekil duyuru detay sayfası (Read)
router.get('/:id', AnnouncementController.showAnnouncement);

// GET /announcements/:id/edit - Duyuru düzenleme formu sayfası
router.get('/:id/edit', AnnouncementController.renderEditForm);

// POST /announcements/:id - Duyuru güncelleme işlemi (Update - U)
router.post('/:id', AnnouncementController.updateAnnouncement);

// POST /announcements/:id/edit - Alternatif güncelleme form rotası
router.post('/:id/edit', AnnouncementController.updateAnnouncement);

// PUT /announcements/:id - REST/Method-override destekli güncelleme
router.put('/:id', AnnouncementController.updateAnnouncement);

// POST /announcements/:id/delete - Duyuru silme işlemi (Delete - D)
router.post('/:id/delete', AnnouncementController.deleteAnnouncement);

// DELETE /announcements/:id - REST/Method-override destekli silme
router.delete('/:id', AnnouncementController.deleteAnnouncement);

export default router;
