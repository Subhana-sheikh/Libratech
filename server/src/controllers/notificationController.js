import Notification from '../models/Notification.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { runDueReminders } from '../jobs/reminderJob.js';

export const getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = await Notification.countDocuments({
      userId: req.user._id,
      readAt: null
    });

    return successResponse(res, {
      notifications,
      unreadCount
    }, 'Notifications retrieved.');
  } catch (err) {
    next(err);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const notif = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { readAt: new Date() },
      { new: true }
    );

    if (!notif) return errorResponse(res, 'Notification not found.', 404);

    return successResponse(res, notif, 'Notification marked as read.');
  } catch (err) {
    next(err);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, readAt: null },
      { readAt: new Date() }
    );

    return successResponse(res, null, 'All notifications marked as read.');
  } catch (err) {
    next(err);
  }
};

export const triggerTestReminders = async (req, res, next) => {
  try {
    const result = await runDueReminders();
    return successResponse(res, result, `Test reminder scan completed. Generated ${result.generatedCount} notification(s).`);
  } catch (err) {
    next(err);
  }
};
