import { Router } from 'express';
import {
  getOverviewAnalytics,
  getBorrowingTrends,
  getActivityLogs,
  getLibrarySettingsHandler,
  updateLibrarySettingsHandler
} from '../controllers/adminController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { ROLES } from '../config/constants.js';

const router = Router();

router.use(authenticate, authorize(ROLES.ADMIN));

router.get('/analytics/overview', getOverviewAnalytics);
router.get('/analytics/borrowing', getBorrowingTrends);
router.get('/activity', getActivityLogs);
router.get('/settings', getLibrarySettingsHandler);
router.patch('/settings', updateLibrarySettingsHandler);

export default router;
