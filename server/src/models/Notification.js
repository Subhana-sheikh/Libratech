import mongoose from 'mongoose';
import { NOTIFICATION_TYPES } from '../config/constants.js';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: Object.values(NOTIFICATION_TYPES),
    default: NOTIFICATION_TYPES.GENERAL
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  relatedLoanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loan'
  },
  deduplicationKey: {
    type: String,
    trim: true,
    index: true
  },
  readAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
