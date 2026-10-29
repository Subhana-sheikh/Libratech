import Loan from '../models/Loan.js';
import Book from '../models/Book.js';
import BookCopy from '../models/BookCopy.js';
import User from '../models/User.js';
import { issueBook, returnBook } from '../services/circulationService.js';
import { calculateFine } from '../utils/fineCalculator.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { LOAN_STATUS } from '../config/constants.js';

export const issueLoan = async (req, res, next) => {
  try {
    const { userId, bookId, bookCopyId } = req.body;

    if (!userId || !bookId) {
      return errorResponse(res, 'Student ID and Book ID are required to issue a loan.', 400);
    }

    const loan = await issueBook({
      userId,
      bookId,
      bookCopyId,
      staffUserId: req.user._id
    });

    return successResponse(res, loan, 'Book successfully issued to student.', 201);
  } catch (err) {
    next(err);
  }
};

export const returnLoan = async (req, res, next) => {
  try {
    const loanId = req.params.id;
    if (!loanId) return errorResponse(res, 'Loan ID is required.', 400);

    const result = await returnBook({
      loanId,
      staffUserId: req.user._id
    });

    return successResponse(res, result, 'Book successfully returned and inventory restored.');
  } catch (err) {
    next(err);
  }
};

export const getMyActiveLoans = async (req, res, next) => {
  try {
    const loans = await Loan.find({
      userId: req.user._id,
      status: { $in: [LOAN_STATUS.ACTIVE, LOAN_STATUS.OVERDUE] }
    })
      .populate('bookId', 'title authors coverImageUrl isbn')
      .populate('bookCopyId', 'accessionCode barcodeValue location')
      .sort({ dueAt: 1 });

    const enriched = loans.map(l => {
      const fineCalc = calculateFine({
        dueAt: l.dueAt,
        finePerDay: l.finePolicySnapshot?.finePerDay,
        maxFine: l.finePolicySnapshot?.maxFine,
        gracePeriodDays: l.finePolicySnapshot?.gracePeriodDays
      });

      const daysRemaining = Math.ceil((new Date(l.dueAt) - new Date()) / (1000 * 60 * 60 * 24));

      return {
        ...l.toObject(),
        isOverdue: fineCalc.isOverdue,
        overdueDays: fineCalc.overdueDays,
        projectedFine: fineCalc.fineAmount,
        daysRemaining
      };
    });

    return successResponse(res, enriched, 'Active loans retrieved.');
  } catch (err) {
    next(err);
  }
};

export const getMyLoanHistory = async (req, res, next) => {
  try {
    const loans = await Loan.find({
      userId: req.user._id,
      status: LOAN_STATUS.RETURNED
    })
      .populate('bookId', 'title authors coverImageUrl isbn')
      .populate('bookCopyId', 'accessionCode barcodeValue')
      .sort({ returnedAt: -1 });

    return successResponse(res, loans, 'Loan history retrieved.');
  } catch (err) {
    next(err);
  }
};

export const getAllLoans = async (req, res, next) => {
  try {
    const { status, studentId, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (studentId) {
      query.userId = studentId;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * pageSize;

    let [loans, total] = await Promise.all([
      Loan.find(query)
        .populate('userId', 'name email studentId')
        .populate('bookId', 'title authors coverImageUrl isbn')
        .populate('bookCopyId', 'accessionCode barcodeValue location')
        .populate('issuedBy', 'name email')
        .populate('returnedBy', 'name email')
        .sort({ issuedAt: -1 })
        .skip(skip)
        .limit(pageSize),
      Loan.countDocuments(query)
    ]);

    // Filter by search term if provided (student name or book title)
    if (search && search.trim()) {
      const s = search.trim().toLowerCase();
      loans = loans.filter(l =>
        l.userId?.name?.toLowerCase().includes(s) ||
        l.userId?.studentId?.toLowerCase().includes(s) ||
        l.bookId?.title?.toLowerCase().includes(s) ||
        l.bookCopyId?.barcodeValue?.toLowerCase().includes(s)
      );
    }

    // Attach dynamic fine for active/overdue loans
    const enriched = loans.map(l => {
      if (l.status === LOAN_STATUS.RETURNED) {
        return l;
      }
      const fineCalc = calculateFine({
        dueAt: l.dueAt,
        finePerDay: l.finePolicySnapshot?.finePerDay,
        maxFine: l.finePolicySnapshot?.maxFine,
        gracePeriodDays: l.finePolicySnapshot?.gracePeriodDays
      });
      return {
        ...l.toObject(),
        isOverdue: fineCalc.isOverdue,
        overdueDays: fineCalc.overdueDays,
        projectedFine: fineCalc.fineAmount
      };
    });

    return successResponse(res, enriched, 'Loans retrieved successfully.', 200, {
      page: pageNum,
      limit: pageSize,
      total,
      pages: Math.ceil(total / pageSize)
    });
  } catch (err) {
    next(err);
  }
};

export const getLoanById = async (req, res, next) => {
  try {
    const loan = await Loan.findById(req.params.id)
      .populate('userId', 'name email studentId department')
      .populate('bookId')
      .populate('bookCopyId')
      .populate('issuedBy', 'name')
      .populate('returnedBy', 'name');

    if (!loan) return errorResponse(res, 'Loan record not found.', 404);

    let fineInfo = null;
    if (loan.status !== LOAN_STATUS.RETURNED) {
      fineInfo = calculateFine({
        dueAt: loan.dueAt,
        finePerDay: loan.finePolicySnapshot?.finePerDay,
        maxFine: loan.finePolicySnapshot?.maxFine
      });
    }

    return successResponse(res, { loan, fineInfo }, 'Loan details retrieved.');
  } catch (err) {
    next(err);
  }
};

/**
 * Scan resolver: Resolves barcode or accession code to book copy and active loan.
 */
export const scanResolve = async (req, res, next) => {
  try {
    const { code } = req.query;
    if (!code || !code.trim()) {
      return errorResponse(res, 'Barcode or accession code is required.', 400);
    }

    const trimmed = code.trim();

    // Look for BookCopy by barcode or accessionCode
    let copy = await BookCopy.findOne({
      $or: [
        { barcodeValue: trimmed },
        { accessionCode: trimmed.toUpperCase() }
      ]
    }).populate('bookId');

    // If not found as copy, search Book by ISBN
    let book = null;
    if (copy) {
      book = copy.bookId;
    } else {
      book = await Book.findOne({ isbn: trimmed });
    }

    if (!book) {
      return errorResponse(res, `No book or copy found for scanned code "${trimmed}".`, 404);
    }

    // Check if this copy or book is currently on an active loan
    let activeLoan = null;
    if (copy) {
      activeLoan = await Loan.findOne({
        bookCopyId: copy._id,
        status: { $in: [LOAN_STATUS.ACTIVE, LOAN_STATUS.OVERDUE] }
      }).populate('userId', 'name email studentId');
    }

    return successResponse(res, {
      code: trimmed,
      copy,
      book,
      activeLoan,
      suggestedAction: activeLoan ? 'RETURN' : (book.availableCopies > 0 ? 'ISSUE' : 'UNAVAILABLE')
    }, 'Code resolved.');
  } catch (err) {
    next(err);
  }
};
