import { Router } from 'express';
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { ROLES } from '../config/constants.js';

const router = Router();

router.get('/', getAllCategories);
router.post('/', authenticate, authorize(ROLES.LIBRARIAN, ROLES.ADMIN), createCategory);
router.patch('/:id', authenticate, authorize(ROLES.LIBRARIAN, ROLES.ADMIN), updateCategory);
router.delete('/:id', authenticate, authorize(ROLES.ADMIN), deleteCategory);

export default router;
