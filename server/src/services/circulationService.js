import mongoose from 'mongoose';
import Book from '../models/Book.js';
import BookCopy from '../models/BookCopy.js';
import Loan from '../models/Loan.js';
import Fine from '../models/Fine.js';
import User from '../models/User.js';
import LibrarySetting from '../models/LibrarySetting.js';
import Notification from '../models/Notification.js';
import { LOAN_STATUS, COPY_STATUS, FINE_STATUS, NOTIFICATION_TYPES } from '../config/constants.js';
import { calculateFine } from '../utils/fineCalculator.js';
import { logAudit } from '../utils/auditLogger.js';

export const getLibrarySettings = async () => {
  let settings = await LibrarySetting.findOne();
  if (!settings) {
    settings = await LibrarySetting.create({
      loanDurationDays: Number(process.env.LOAN_DURATION_DAYS || 14),
      gracePeriodDays: Number(process.env.GRACE_PERIOD_DAYS || 0),
      finePerDay: Number(process.env.FINE_PER_DAY || 5),
      maxFine: Number(process.env.MAX_FINE || 500),
      maxBooksPerStudent: Number(process.env.MAX_BOOKS_PER_STUDENT || 4),
      timezone: process.env.LIBRARY_TIMEZONE || 'Asia/Kolkata'
    });
  }
  return settings;
};

/**
 * Issue a book to a student with atomic inventory safeguards.
 */
export const issueBook = async ({ userId, bookId, bookCopyId = null, staffUserId }) => {
  // 1. Verify user eligibility
  const user = await User.findById(userId);
  if (!user) throw new Error('Student not found');
  if (!user.isActive) throw new Error('Student account is deactivated');

  const settings = await getLibrarySettings();

  // Check active borrowing limit
  const activeLoansCount = await Loan.countDocuments({
    userId,
    status: { $in: [LOAN_STATUS.ACTIVE, LOAN_STATUS.OVERDUE] }
  });

  if (activeLoansCount >= settings.maxBooksPerStudent) {
    throw new Error(`Student has reached maximum allowed active loans (${settings.maxBooksPerStudent}).`);
  }

  // Check unpaid fines limit (e.g. > 100 blocks new borrowing)
  const unpaidFines = await Fine.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId), status: { $in: [FINE_STATUS.UNPAID, FINE_STATUS.PARTIALLY_PAID] } } },
    { $group: { _id: null, total: { $sum: { $subtract: ['$amount', '$paidAmount'] } } } }
  ]);
  const totalUnpaid = unpaidFines.length > 0 ? unpaidFines[0].total : 0;
  if (totalUnpaid > 200) {
    throw new Error(`Student has outstanding unpaid fines of ₹${totalUnpaid}. Please settle fines before borrowing.`);
  }

  // 2. Verify and atomically reserve book inventory
  const book = await Book.findById(bookId);
  if (!book) throw new Error('Book not found');
  if (book.isArchived) throw new Error('This book has been archived and cannot be issued');

  // Decrement available copies atomically only if availableCopies > 0
  const updatedBook = await Book.findOneAndUpdate(
    { _id: bookId, availableCopies: { $gt: 0 }, isArchived: false },
    { $inc: { availableCopies: -1, popularityCount: 1 } },
    { new: true }
  );

  if (!updatedBook) {
    throw new Error('No available copies remaining for this book.');
  }

  // 3. Resolve BookCopy
  let copy = null;
  if (bookCopyId) {
    copy = await BookCopy.findOne({ _id: bookCopyId, bookId, status: COPY_STATUS.AVAILABLE });
    if (!copy) {
      // Rollback inventory decrement
      await Book.findByIdAndUpdate(bookId, { $inc: { availableCopies: 1, popularityCount: -1 } });
      throw new Error('Specified book copy is not available.');
    }
  } else {
    // Pick first available copy
    copy = await BookCopy.findOne({ bookId, status: COPY_STATUS.AVAILABLE });
  }

  if (copy) {
    copy.status = COPY_STATUS.ISSUED;
    await copy.save();
  }

  // 4. Calculate due date
  const now = new Date();
  const dueAt = new Date(now.getTime() + settings.loanDurationDays * 24 * 60 * 60 * 1000);

  // 5. Create Loan record
  const loan = await Loan.create({
    userId,
    bookId,
    bookCopyId: copy ? copy._id : null,
    issuedAt: now,
    dueAt,
    status: LOAN_STATUS.ACTIVE,
    issuedBy: staffUserId,
    finePolicySnapshot: {
      finePerDay: settings.finePerDay,
      maxFine: settings.maxFine,
      gracePeriodDays: settings.gracePeriodDays
    }
  });

  // 6. Audit & Notification
  await logAudit({
    actorUserId: staffUserId,
    action: 'LOAN_ISSUE',
    entityType: 'Loan',
    entityId: loan._id,
    metadata: {
      studentId: user._id,
      studentName: user.name,
      bookId: book._id,
      bookTitle: book.title,
      copyBarcode: copy?.barcodeValue,
      dueAt: dueAt.toISOString()
    }
  });

  await Notification.create({
    userId,
    type: NOTIFICATION_TYPES.GENERAL,
    title: 'Book Issued',
    message: `"${book.title}" was issued to you. Due date: ${dueAt.toLocaleDateString()}.`,
    relatedLoanId: loan._id,
    deduplicationKey: `issue-${loan._id}`
  });

  return await Loan.findById(loan._id).populate('bookId').populate('bookCopyId').populate('userId', 'name email studentId');
};

/**
 * Return a borrowed book, calculate fine, restore inventory exactly once.
 */
export const returnBook = async ({ loanId, staffUserId }) => {
  const loan = await Loan.findById(loanId).populate('bookId');
  if (!loan) throw new Error('Loan record not found');

  // Guard against duplicate returns
  if (loan.status === LOAN_STATUS.RETURNED) {
    throw new Error('This loan has already been returned.');
  }

  const now = new Date();
  const settings = await getLibrarySettings();

  // Authoritative fine calculation
  const fineResult = calculateFine({
    dueAt: loan.dueAt,
    returnedAt: now,
    finePerDay: loan.finePolicySnapshot?.finePerDay || settings.finePerDay,
    maxFine: loan.finePolicySnapshot?.maxFine || settings.maxFine,
    gracePeriodDays: loan.finePolicySnapshot?.gracePeriodDays || settings.gracePeriodDays
  });

  // Update loan record
  loan.status = LOAN_STATUS.RETURNED;
  loan.returnedAt = now;
  loan.returnedBy = staffUserId;
  loan.fineAtReturn = fineResult.fineAmount;
  await loan.save();

  // Restore inventory exactly once
  await Book.findByIdAndUpdate(loan.bookId._id, {
    $inc: { availableCopies: 1 }
  });

  // Update physical copy if assigned
  if (loan.bookCopyId) {
    await BookCopy.findByIdAndUpdate(loan.bookCopyId, {
      status: COPY_STATUS.AVAILABLE
    });
  }

  // If fine is incurred, record fine record
  let fineDoc = null;
  if (fineResult.fineAmount > 0) {
    fineDoc = await Fine.create({
      loanId: loan._id,
      userId: loan.userId,
      amount: fineResult.fineAmount,
      paidAmount: 0,
      status: FINE_STATUS.UNPAID,
      reason: `Overdue return (${fineResult.overdueDays} days late)`
    });

    await Notification.create({
      userId: loan.userId,
      type: NOTIFICATION_TYPES.FINE_ISSUED,
      title: 'Fine Incurred',
      message: `A fine of ₹${fineResult.fineAmount} was assessed for overdue return of "${loan.bookId.title}".`,
      relatedLoanId: loan._id,
      deduplicationKey: `fine-return-${loan._id}`
    });
  }

  // Audit log
  await logAudit({
    actorUserId: staffUserId,
    action: 'LOAN_RETURN',
    entityType: 'Loan',
    entityId: loan._id,
    metadata: {
      studentId: loan.userId,
      bookTitle: loan.bookId.title,
      returnedAt: now.toISOString(),
      overdueDays: fineResult.overdueDays,
      fineAmount: fineResult.fineAmount
    }
  });

  await Notification.create({
    userId: loan.userId,
    type: NOTIFICATION_TYPES.RETURN_CONFIRMED,
    title: 'Return Confirmed',
    message: `"${loan.bookId.title}" has been successfully returned.`,
    relatedLoanId: loan._id,
    deduplicationKey: `return-${loan._id}`
  });

  return {
    loan,
    fine: fineDoc,
    fineBreakdown: fineResult
  };
};
