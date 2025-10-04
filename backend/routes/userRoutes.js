import express from 'express';
import { listUsers, createUser, updateUser, deleteUser } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { allowRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', allowRoles('Admin'), listUsers);
router.post('/', allowRoles('Admin'), createUser);
router.put('/:id', allowRoles('Admin'), updateUser);
router.delete('/:id', allowRoles('Admin'), deleteUser);

export default router;
