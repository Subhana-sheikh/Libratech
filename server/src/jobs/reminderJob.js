import cron from 'node-cron';
import Loan from '../models/Loan.js';
import Notification from '../models/Notification.js';
import { LOAN_STATUS, NOTIFICATION_TYPES } from '../config/constants.js';

/**
 * Idempotent reminder generator:
 * Inspects all active loans and creates notifications for:
 * - 3 days before due date
 * - 1 day before due date
 * - Today (due date)
 * - Overdue loans
 * Deduplication is enforced by unique deduplicationKey: `${stage}-${loanId}-${yearMonthDay}`
 */
export const runDueReminders = async () => {
  console.log('[Reminder Job] Running due-date reminder scan...');
  const now = new Date();
  const startOfDay = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));

  // Active loans
  const loans = await Loan.find({
    status: { $in: [LOAN_STATUS.ACTIVE, LOAN_STATUS.OVERDUE] }
  }).populate('bookId', 'title');

  let generatedCount = 0;

  for (const loan of loans) {
    if (!loan.bookId) continue;

    const dueDate = new Date(loan.dueAt);
    const dueMidnight = new Date(Date.UTC(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate()));
    const daysDiff = Math.round((dueMidnight.getTime() - startOfDay.getTime()) / (1000 * 60 * 60 * 24));

    let stage = null;
    let type = NOTIFICATION_TYPES.DUE_SOON;
    let title = '';
    let message = '';

    if (daysDiff === 3) {
      stage = 'due-3-days';
      title = 'Loan Due Soon (3 days)';
      message = `"${loan.bookId.title}" is due in 3 days on ${dueDate.toLocaleDateString()}.`;
    } else if (daysDiff === 1) {
      stage = 'due-1-day';
      title = 'Loan Due Tomorrow';
      message = `"${loan.bookId.title}" is due tomorrow on ${dueDate.toLocaleDateString()}.`;
    } else if (daysDiff === 0) {
      stage = 'due-today';
      title = 'Loan Due Today';
      message = `"${loan.bookId.title}" is due today. Please return or renew it to avoid overdue fines.`;
    } else if (daysDiff < 0) {
      stage = `overdue-${Math.abs(daysDiff)}`;
      type = NOTIFICATION_TYPES.OVERDUE;
      title = 'Book Overdue';
      message = `"${loan.bookId.title}" is ${Math.abs(daysDiff)} day(s) overdue. Please return it to the library immediately.`;
      
      // Update status to OVERDUE if still ACTIVE
      if (loan.status === LOAN_STATUS.ACTIVE) {
        loan.status = LOAN_STATUS.OVERDUE;
        await loan.save();
      }
    }

    if (stage) {
      const dedupKey = `reminder-${loan._id}-${stage}`;
      const existing = await Notification.findOne({ deduplicationKey: dedupKey });

      if (!existing) {
        await Notification.create({
          userId: loan.userId,
          type,
          title,
          message,
          relatedLoanId: loan._id,
          deduplicationKey: dedupKey
        });
        generatedCount++;
      }
    }
  }

  console.log(`[Reminder Job] Completed scan. Generated ${generatedCount} new notification(s).`);
  return { generatedCount, totalScanned: loans.length };
};

export const initReminderScheduler = () => {
  // Run daily at 08:00 AM in configured timezone
  const cronPattern = '0 8 * * *';
  cron.schedule(cronPattern, async () => {
    try {
      await runDueReminders();
    } catch (err) {
      console.error('[Reminder Job Cron Error]', err);
    }
  });
  console.log('[Reminder Job] Scheduled daily due-date alerts job at 08:00 AM');
};
