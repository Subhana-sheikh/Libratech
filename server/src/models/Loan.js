import mongoose from 'mongoose';
import { LOAN_STATUS } from '../config/constants.js';

const loanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
    index: true
  },
  bookCopyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BookCopy',
    index: true
  },
  issuedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  dueAt: {
    type: Date,
    required: true,
    index: true
  },
  returnedAt: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: Object.values(LOAN_STATUS),
    default: LOAN_STATUS.ACTIVE,
    index: true
  },
  issuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  returnedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  fineAtReturn: {
    type: Number,
    default: 0
  },
  finePolicySnapshot: {
    finePerDay: Number,
    maxFine: Number,
    gracePeriodDays: Number
  }
}, {
  timestamps: true
});

// Dynamic helper to check if loan is currently overdue
loanSchema.methods.checkOverdue = function () {
  if (this.status === LOAN_STATUS.RETURNED) return false;
  return new Date() > new Date(this.dueAt);
};

const Loan = mongoose.model('Loan', loanSchema);
export default Loan;
