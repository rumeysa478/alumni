/**
 * @file src/routes/apiUser.routes.js
 * @description REST API Kullanıcı Rotaları (ApiUserController ile eşleşen JSON API rotaları)
 */

import { Router } from 'express';
import multer from 'multer';
import ApiUserController from '../controllers/apiUserController.js';

const upload = multer();
const router = Router();

// GET /api/users - Eklenen kullanıcıları JSON formatında listeleme (Read)
router.get('/', ApiUserController.getUsers);

// POST /api/users - Yeni kullanıcı oluşturma (Create - Form-data, URL-encoded ve JSON)
router.post('/', upload.none(), ApiUserController.createUser);

// GET /api/users/:id - ID ile tekil kullanıcı getirme (Read)
router.get('/:id', ApiUserController.getUserById);

// PUT /api/users/:id - Kullanıcı kaydını tam güncelleme (Update)
router.put('/:id', upload.none(), ApiUserController.updateUser);

// PATCH /api/users/:id - Kullanıcı kaydını kısmi güncelleme (Update)
router.patch('/:id', upload.none(), ApiUserController.patchUser);

// DELETE /api/users/:id - Kullanıcı kaydını silme (Delete)
router.delete('/:id', ApiUserController.deleteUser);

export default router;
