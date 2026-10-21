/**
 * @file src/routes/event.routes.js
 * @description Web MVC Etkinlik Rotaları (/events)
 * @author Rumeysa Aydın
 */

import { Router } from 'express';
import EventController from '../controllers/eventController.js';

const router = Router();

// GET /events - Etkinlikleri listeleme
router.get('/', EventController.listEvents);

// GET /events/new - Yeni etkinlik formu
router.get('/new', EventController.newEventForm);

// POST /events - Yeni etkinlik oluşturma
router.post('/', EventController.createEvent);

// GET /events/:id - Etkinlik detayları
router.get('/:id', EventController.showEvent);

// GET /events/:id/edit - Etkinlik düzenleme formu
router.get('/:id/edit', EventController.editEventForm);

// POST /events/:id - Etkinlik güncelleme
router.post('/:id', EventController.updateEvent);

// POST /events/:id/delete - Etkinlik silme
router.post('/:id/delete', EventController.deleteEvent);

// POST /events/:id/register - Etkinliğe kayıt olma (N:M relation)
router.post('/:id/register', EventController.registerAttendee);

export default router;
