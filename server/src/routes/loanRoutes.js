import { Router } from 'express';
import {
  issueLoan,
  returnLoan,
  getMyActiveLoans,
  getMyLoanHistory,
  getAllLoans,
  getLoanById,
  scanResolve
} from '../controllers/loanController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { ROLES } from '../config/constants.js';

const router = Router();

// Student endpoints
router.get('/me', authenticate, getMyActiveLoans);
router.get('/me/history', authenticate, getMyLoanHistory);

// Barcode/QR scan resolver (Staff/Admin)
router.get('/scan-resolve', authenticate, authorize(ROLES.LIBRARIAN, ROLES.ADMIN), scanResolve);

// Staff circulation endpoints
router.get('/', authenticate, authorize(ROLES.LIBRARIAN, ROLES.ADMIN), getAllLoans);
router.post('/issue', authenticate, authorize(ROLES.LIBRARIAN, ROLES.ADMIN), issueLoan);
router.post('/:id/return', authenticate, authorize(ROLES.LIBRARIAN, ROLES.ADMIN), returnLoan);
router.get('/:id', authenticate, getLoanById);

export default router;
