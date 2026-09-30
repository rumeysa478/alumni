import { Router } from 'express';
import multer from 'multer';
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  patchUser,
  deleteUser
} from '../controllers/user.controller.js';

const upload = multer();
const router = Router();

// POST /api/users - Form-data, x-www-form-urlencoded ve JSON desteği
router.post('/', upload.none(), createUser);

// GET /api/users - Eklenen kullanıcıları listeleme
router.get('/', getUsers);

// GET /api/users/:id - Tekil kullanıcı getirme (ID ile çağırma)
router.get('/:id', getUserById);

// PUT /api/users/:id - Kullanıcı kaydını tam güncelleme (Form veya JSON)
router.put('/:id', upload.none(), updateUser);

// PATCH /api/users/:id - Kullanıcı kaydını kısmi güncelleme (Form veya JSON)
router.patch('/:id', upload.none(), patchUser);

// DELETE /api/users/:id - Kullanıcı kaydını silme
router.delete('/:id', deleteUser);

export default router;
