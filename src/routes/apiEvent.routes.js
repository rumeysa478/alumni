/**
 * @file src/routes/apiEvent.routes.js
 * @description REST API Etkinlik Rotaları (/api/events)
 * @author Rumeysa Aydın
 */

import { Router } from 'express';
import ApiEventController from '../controllers/apiEventController.js';

const router = Router();

// GET /api/events - Etkinlikleri listeleme
router.get('/', ApiEventController.getEvents);

// POST /api/events - Yeni etkinlik oluşturma
router.post('/', ApiEventController.createEvent);

// GET /api/events/:id - Tekil etkinlik detayı
router.get('/:id', ApiEventController.getEventById);

// PUT /api/events/:id - Etkinlik güncelleme
router.put('/:id', ApiEventController.updateEvent);

// DELETE /api/events/:id - Etkinlik silme
router.delete('/:id', ApiEventController.deleteEvent);

// POST /api/events/:id/register - Etkinliğe kayıt olma (N:M relation)
router.post('/:id/register', ApiEventController.registerAttendee);

// GET /api/events/:id/attendees - Etkinliğin katılımcılarını listeleme
router.get('/:id/attendees', ApiEventController.getEventAttendees);

export default router;
