import Book from '../models/Book.js';
import BookCopy from '../models/BookCopy.js';
import Loan from '../models/Loan.js';
import Fine from '../models/Fine.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import AuditLog from '../models/AuditLog.js';
import LibrarySetting from '../models/LibrarySetting.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { ROLES, LOAN_STATUS, FINE_STATUS } from '../config/constants.js';
import { getLibrarySettings } from '../services/circulationService.js';
import { logAudit } from '../utils/auditLogger.js';

export const getOverviewAnalytics = async (req, res, next) => {
  try {
    const [
      totalTitles,
      totalCopiesAgg,
      activeLoans,
      overdueLoans,
      registeredStudents,
      unpaidFinesAgg
    ] = await Promise.all([
      Book.countDocuments({ isArchived: false }),
      Book.aggregate([
        { $match: { isArchived: false } },
        { $group: { _id: null, totalCopies: { $sum: '$totalCopies' }, availableCopies: { $sum: '$availableCopies' } } }
      ]),
      Loan.countDocuments({ status: LOAN_STATUS.ACTIVE }),
      Loan.countDocuments({ status: LOAN_STATUS.OVERDUE }),
      User.countDocuments({ role: ROLES.STUDENT }),
      Fine.aggregate([
        { $match: { status: { $in: [FINE_STATUS.UNPAID, FINE_STATUS.PARTIALLY_PAID] } } },
        { $group: { _id: null, total: { $sum: { $subtract: ['$amount', '$paidAmount'] } } } }
      ])
    ]);

    const totalCopies = totalCopiesAgg.length > 0 ? totalCopiesAgg[0].totalCopies : 0;
    const availableCopies = totalCopiesAgg.length > 0 ? totalCopiesAgg[0].availableCopies : 0;
    const issuedCopies = Math.max(0, totalCopies - availableCopies);
    const outstandingFines = unpaidFinesAgg.length > 0 ? unpaidFinesAgg[0].total : 0;

    return successResponse(res, {
      totalTitles,
      totalCopies,
      availableCopies,
      issuedCopies,
      activeLoans,
      overdueLoans,
      registeredStudents,
      outstandingFines
    }, 'Overview analytics retrieved.');
  } catch (err) {
    next(err);
  }
};

export const getBorrowingTrends = async (req, res, next) => {
  try {
    // 1. Most borrowed books
    const topBooks = await Book.find({ isArchived: false })
      .select('title authors popularityCount availableCopies totalCopies')
      .sort({ popularityCount: -1 })
      .limit(6);

    // 2. Category distribution
    const categoryDistribution = await Book.aggregate([
      { $match: { isArchived: false } },
      { $group: { _id: '$categoryId', count: { $sum: 1 }, totalCopies: { $sum: '$totalCopies' } } },
      { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
      { $unwind: '$category' },
      { $project: { name: '$category.name', count: 1, totalCopies: 1 } },
      { $sort: { count: -1 } },
      { $limit: 6 }
    ]);

    // 3. Issue and Return activity over recent 7 days / weeks
    const loansOverTime = await Loan.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$issuedAt' },
            month: { $month: '$issuedAt' },
            day: { $dayOfMonth: '$issuedAt' }
          },
          issues: { $sum: 1 },
          returns: {
            $sum: { $cond: [{ $eq: ['$status', LOAN_STATUS.RETURNED] }, 1, 0] }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
      { $limit: 14 }
    ]);

    const formattedTrends = loansOverTime.map(item => ({
      date: `${item._id.month}/${item._id.day}`,
      issues: item.issues,
      returns: item.returns
    }));

    return successResponse(res, {
      topBooks,
      categoryDistribution,
      activityTrends: formattedTrends
    }, 'Borrowing trends and chart analytics retrieved.');
  } catch (err) {
    next(err);
  }
};

export const getActivityLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 25 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * pageSize;

    const [logs, total] = await Promise.all([
      AuditLog.find()
        .populate('actorUserId', 'name email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize),
      AuditLog.countDocuments()
    ]);

    return successResponse(res, logs, 'Activity audit logs retrieved.', 200, {
      page: pageNum,
      limit: pageSize,
      total,
      pages: Math.ceil(total / pageSize)
    });
  } catch (err) {
    next(err);
  }
};

export const getLibrarySettingsHandler = async (req, res, next) => {
  try {
    const settings = await getLibrarySettings();
    return successResponse(res, settings, 'Library settings retrieved.');
  } catch (err) {
    next(err);
  }
};

export const updateLibrarySettingsHandler = async (req, res, next) => {
  try {
    let settings = await LibrarySetting.findOne();
    if (!settings) {
      settings = new LibrarySetting();
    }

    const {
      loanDurationDays,
      gracePeriodDays,
      finePerDay,
      maxFine,
      maxBooksPerStudent,
      timezone,
      libraryName,
      contactEmail
    } = req.body;

    if (loanDurationDays !== undefined) settings.loanDurationDays = Number(loanDurationDays);
    if (gracePeriodDays !== undefined) settings.gracePeriodDays = Number(gracePeriodDays);
    if (finePerDay !== undefined) settings.finePerDay = Number(finePerDay);
    if (maxFine !== undefined) settings.maxFine = Number(maxFine);
    if (maxBooksPerStudent !== undefined) settings.maxBooksPerStudent = Number(maxBooksPerStudent);
    if (timezone) settings.timezone = timezone.trim();
    if (libraryName) settings.libraryName = libraryName.trim();
    if (contactEmail) settings.contactEmail = contactEmail.trim();

    await settings.save();

    await logAudit({
      actorUserId: req.user._id,
      action: 'UPDATE_LIBRARY_SETTINGS',
      entityType: 'LibrarySetting',
      entityId: settings._id,
      metadata: { ...req.body }
    });

    return successResponse(res, settings, 'Library policy settings updated.');
  } catch (err) {
    next(err);
  }
};
