import { Router } from 'express';
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  triggerTestReminders
} from '../controllers/notificationController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { ROLES } from '../config/constants.js';

const router = Router();

router.get('/', authenticate, getMyNotifications);
router.patch('/read-all', authenticate, markAllAsRead);
router.patch('/:id/read', authenticate, markAsRead);
router.post('/test-reminders', authenticate, authorize(ROLES.ADMIN, ROLES.LIBRARIAN), triggerTestReminders);

export default router;
