import mongoose from 'mongoose';
import { FINE_STATUS } from '../config/constants.js';

const fineAdjustmentSchema = new mongoose.Schema({
  actorUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  previousAmount: Number,
  newAmount: Number,
  reason: {
    type: String,
    required: true,
    trim: true
  },
  action: {
    type: String,
    enum: ['WAIVE', 'REDUCE', 'PAYMENT', 'RECORD'],
    default: 'PAYMENT'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { _id: true });

const fineSchema = new mongoose.Schema({
  loanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loan',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  paidAmount: {
    type: Number,
    min: 0,
    default: 0
  },
  status: {
    type: String,
    enum: Object.values(FINE_STATUS),
    default: FINE_STATUS.UNPAID,
    index: true
  },
  reason: {
    type: String,
    default: 'Overdue loan return fine',
    trim: true
  },
  adjustments: [fineAdjustmentSchema]
}, {
  timestamps: true
});

const Fine = mongoose.model('Fine', fineSchema);
export default Fine;
