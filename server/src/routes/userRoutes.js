import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserStatus,
  updateUserRole
} from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { ROLES } from '../config/constants.js';

const router = Router();

router.get('/', authenticate, authorize(ROLES.LIBRARIAN, ROLES.ADMIN), getAllUsers);
router.get('/:id', authenticate, getUserById);
router.patch('/:id/status', authenticate, authorize(ROLES.ADMIN), updateUserStatus);
router.patch('/:id/role', authenticate, authorize(ROLES.ADMIN), updateUserRole);

export default router;
