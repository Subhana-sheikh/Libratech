import { Router } from 'express';
import {
  getMyFines,
  getAllFines,
  updatePaymentStatus,
  adjustFine
} from '../controllers/fineController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { ROLES } from '../config/constants.js';

const router = Router();

// Student fines
router.get('/me', authenticate, getMyFines);

// Staff/Admin fines management
router.get('/', authenticate, authorize(ROLES.LIBRARIAN, ROLES.ADMIN), getAllFines);
router.patch('/:id/payment-status', authenticate, authorize(ROLES.LIBRARIAN, ROLES.ADMIN), updatePaymentStatus);
router.post('/:id/adjustments', authenticate, authorize(ROLES.ADMIN), adjustFine);

export default router;
