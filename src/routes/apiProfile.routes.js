/**
 * @file src/routes/apiProfile.routes.js
 * @description REST API Mezun Profili Rotaları (/api/profiles)
 * @author Rumeysa Aydın
 */

import { Router } from 'express';
import ApiProfileController from '../controllers/apiProfileController.js';

const router = Router();

// GET /api/profiles - Tüm profilleri listeleme
router.get('/', ApiProfileController.getProfiles);

// POST /api/profiles - Yeni profil oluşturma
router.post('/', ApiProfileController.createProfile);

// GET /api/profiles/:userId - Belirli bir kullanıcının profilini alma
router.get('/:userId', ApiProfileController.getProfileByUserId);

// PUT /api/profiles/:userId - Kullanıcı profilini güncelleme
router.put('/:userId', ApiProfileController.updateProfile);

export default router;
