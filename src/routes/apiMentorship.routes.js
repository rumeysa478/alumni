/**
 * @file src/routes/apiMentorship.routes.js
 * @description REST API Mentörlük Rotaları (/api/mentorships)
 * @author Rumeysa Aydın
 */

import { Router } from 'express';
import ApiMentorshipController from '../controllers/apiMentorshipController.js';

const router = Router();

// GET /api/mentorships - Mentörlük ilişkilerini listeleme
router.get('/', ApiMentorshipController.getMentorships);

// POST /api/mentorships - Yeni mentörlük talebi
router.post('/', ApiMentorshipController.createMentorship);

// GET /api/mentorships/:id - Tekil mentörlük detayı
router.get('/:id', ApiMentorshipController.getMentorshipById);

// PUT /api/mentorships/:id - Durum güncelleme
router.put('/:id', ApiMentorshipController.updateMentorship);

// DELETE /api/mentorships/:id - Mentörlük ilişkisini silme
router.delete('/:id', ApiMentorshipController.deleteMentorship);

export default router;
