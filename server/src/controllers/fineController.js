import Fine from '../models/Fine.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { FINE_STATUS, NOTIFICATION_TYPES } from '../config/constants.js';
import { logAudit } from '../utils/auditLogger.js';

export const getMyFines = async (req, res, next) => {
  try {
    const fines = await Fine.find({ userId: req.user._id })
      .populate({
        path: 'loanId',
        populate: { path: 'bookId', select: 'title authors coverImageUrl' }
      })
      .sort({ createdAt: -1 });

    const totalUnpaid = fines
      .filter(f => f.status === FINE_STATUS.UNPAID || f.status === FINE_STATUS.PARTIALLY_PAID)
      .reduce((sum, f) => sum + (f.amount - (f.paidAmount || 0)), 0);

    return successResponse(res, {
      fines,
      summary: {
        totalFinesCount: fines.length,
        totalUnpaidAmount: totalUnpaid
      }
    }, 'Student fines fetched.');
  } catch (err) {
    next(err);
  }
};

export const getAllFines = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * pageSize;

    let [fines, total] = await Promise.all([
      Fine.find(query)
        .populate('userId', 'name email studentId')
        .populate({
          path: 'loanId',
          populate: { path: 'bookId', select: 'title authors' }
        })
        .populate('adjustments.actorUserId', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize),
      Fine.countDocuments(query)
    ]);

    if (search && search.trim()) {
      const s = search.trim().toLowerCase();
      fines = fines.filter(f =>
        f.userId?.name?.toLowerCase().includes(s) ||
        f.userId?.studentId?.toLowerCase().includes(s) ||
        f.loanId?.bookId?.title?.toLowerCase().includes(s)
      );
    }

    return successResponse(res, fines, 'Fines fetched.', 200, {
      page: pageNum,
      limit: pageSize,
      total,
      pages: Math.ceil(total / pageSize)
    });
  } catch (err) {
    next(err);
  }
};

export const updatePaymentStatus = async (req, res, next) => {
  try {
    const { status, paidAmount, note } = req.body;
    const fine = await Fine.findById(req.params.id).populate('userId', 'name email');

    if (!fine) return errorResponse(res, 'Fine record not found.', 404);

    const prevStatus = fine.status;
    const prevPaid = fine.paidAmount || 0;

    if (status) fine.status = status;
    if (paidAmount !== undefined) fine.paidAmount = Number(paidAmount);

    // Auto update status if fully paid
    if (fine.paidAmount >= fine.amount) {
      fine.status = FINE_STATUS.PAID;
    } else if (fine.paidAmount > 0 && fine.paidAmount < fine.amount) {
      fine.status = FINE_STATUS.PARTIALLY_PAID;
    }

    // Add adjustment log
    fine.adjustments.push({
      actorUserId: req.user._id,
      amount: fine.paidAmount - prevPaid,
      previousAmount: prevPaid,
      newAmount: fine.paidAmount,
      reason: note || `Payment status changed from ${prevStatus} to ${fine.status}`,
      action: status === FINE_STATUS.WAIVED ? 'WAIVE' : 'PAYMENT'
    });

    await fine.save();

    await logAudit({
      actorUserId: req.user._id,
      action: 'FINE_PAYMENT_UPDATE',
      entityType: 'Fine',
      entityId: fine._id,
      metadata: {
        studentId: fine.userId._id,
        newStatus: fine.status,
        paidAmount: fine.paidAmount,
        note
      }
    });

    await Notification.create({
      userId: fine.userId._id,
      type: NOTIFICATION_TYPES.FINE_PAID,
      title: 'Fine Status Updated',
      message: `Your fine record status was updated to ${fine.status}. Recorded paid: ₹${fine.paidAmount}/${fine.amount}.`,
      relatedLoanId: fine.loanId
    });

    return successResponse(res, fine, 'Fine payment status updated.');
  } catch (err) {
    next(err);
  }
};

export const adjustFine = async (req, res, next) => {
  try {
    const { newAmount, reason } = req.body;
    if (newAmount === undefined || !reason) {
      return errorResponse(res, 'New amount and reason are required.', 400);
    }

    const fine = await Fine.findById(req.params.id);
    if (!fine) return errorResponse(res, 'Fine record not found.', 404);

    const previousAmount = fine.amount;
    fine.amount = Math.max(0, Number(newAmount));

    if (fine.amount === 0) {
      fine.status = FINE_STATUS.WAIVED;
    }

    fine.adjustments.push({
      actorUserId: req.user._id,
      amount: fine.amount - previousAmount,
      previousAmount,
      newAmount: fine.amount,
      reason: reason.trim(),
      action: fine.amount === 0 ? 'WAIVE' : 'REDUCE'
    });

    await fine.save();

    await logAudit({
      actorUserId: req.user._id,
      action: 'FINE_ADJUSTMENT',
      entityType: 'Fine',
      entityId: fine._id,
      metadata: { previousAmount, newAmount: fine.amount, reason }
    });

    return successResponse(res, fine, 'Fine adjusted successfully.');
  } catch (err) {
    next(err);
  }
};
