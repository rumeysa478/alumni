/**
 * @file src/routes/user.routes.js
 * @description Web View Katmanı Kullanıcı Rotaları (UserController ile eşleşen MVC rotaları)
 */

import { Router } from 'express';
import UserController from '../controllers/userController.js';

const router = Router();

// GET /users - Tüm kullanıcıları listeleme görünümü (Read - Listings)
router.get('/', UserController.listUsers);

// GET /users/new - Yeni kullanıcı ekleme formu
router.get('/new', UserController.renderCreateForm);

// POST /users - Yeni kullanıcı oluşturma işlemi (Create - C)
router.post('/', UserController.createUser);

// GET /users/:id - Tekil kullanıcı profil detay görünümü (Read)
router.get('/:id', UserController.showUser);

// GET /users/:id/edit - Kullanıcı düzenleme formu görünümü
router.get('/:id/edit', UserController.renderEditForm);

// POST /users/:id - Kullanıcı güncelleme işlemi (Update - U)
router.post('/:id', UserController.updateUser);

// POST /users/:id/edit - Alternatif form güncelleme rotası
router.post('/:id/edit', UserController.updateUser);

// PUT /users/:id - REST/Method-override destekli güncelleme
router.put('/:id', UserController.updateUser);

// POST /users/:id/delete - Kullanıcı silme işlemi (Delete - D)
router.post('/:id/delete', UserController.deleteUser);

// DELETE /users/:id - REST/Method-override destekli silme
router.delete('/:id', UserController.deleteUser);

export default router;
