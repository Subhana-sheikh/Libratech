import User from '../models/User.js';
import Loan from '../models/Loan.js';
import Fine from '../models/Fine.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { ROLES, LOAN_STATUS, FINE_STATUS } from '../config/constants.js';
import { logAudit } from '../utils/auditLogger.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const { role, status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (role && role !== 'all') {
      query.role = role;
    }

    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    if (search && search.trim()) {
      const s = search.trim();
      query.$or = [
        { name: { $regex: s, $options: 'i' } },
        { email: { $regex: s, $options: 'i' } },
        { studentId: { $regex: s, $options: 'i' } }
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * pageSize;

    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(pageSize),
      User.countDocuments(query)
    ]);

    // Attach active loans and unpaid fines count for students
    const userIds = users.map(u => u._id);
    const activeLoans = await Loan.aggregate([
      { $match: { userId: { $in: userIds }, status: { $in: [LOAN_STATUS.ACTIVE, LOAN_STATUS.OVERDUE] } } },
      { $group: { _id: '$userId', count: { $sum: 1 } } }
    ]);
    const loanMap = new Map(activeLoans.map(a => [a._id.toString(), a.count]));

    const usersWithStats = users.map(u => ({
      ...u.toObject(),
      activeLoansCount: loanMap.get(u._id.toString()) || 0
    }));

    return successResponse(res, usersWithStats, 'Users fetched.', 200, {
      page: pageNum,
      limit: pageSize,
      total,
      pages: Math.ceil(total / pageSize)
    });
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return errorResponse(res, 'User not found.', 404);

    // Only self or admin can view details
    if (req.user.role !== ROLES.ADMIN && req.user._id.toString() !== user._id.toString()) {
      return errorResponse(res, 'Access denied.', 403);
    }

    const activeLoans = await Loan.find({
      userId: user._id,
      status: { $in: [LOAN_STATUS.ACTIVE, LOAN_STATUS.OVERDUE] }
    }).populate('bookId', 'title authors coverImageUrl');

    const fines = await Fine.find({ userId: user._id });

    return successResponse(res, {
      user,
      activeLoans,
      fines
    });
  } catch (err) {
    next(err);
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    if (isActive === undefined) return errorResponse(res, 'isActive boolean required.', 400);

    const user = await User.findById(req.params.id);
    if (!user) return errorResponse(res, 'User not found.', 404);

    // Prevent deactivating own account
    if (user._id.toString() === req.user._id.toString()) {
      return errorResponse(res, 'You cannot deactivate your own account.', 400);
    }

    user.isActive = Boolean(isActive);
    await user.save();

    await logAudit({
      actorUserId: req.user._id,
      action: user.isActive ? 'USER_ACTIVATE' : 'USER_DEACTIVATE',
      entityType: 'User',
      entityId: user._id,
      metadata: { targetEmail: user.email, isActive: user.isActive }
    });

    return successResponse(res, user, `User account ${user.isActive ? 'activated' : 'deactivated'}.`);
  } catch (err) {
    next(err);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!role || !Object.values(ROLES).includes(role)) {
      return errorResponse(res, `Invalid role. Must be one of [${Object.values(ROLES).join(', ')}]`, 400);
    }

    const user = await User.findById(req.params.id);
    if (!user) return errorResponse(res, 'User not found.', 404);

    // Prevent changing own role
    if (user._id.toString() === req.user._id.toString()) {
      return errorResponse(res, 'You cannot change your own role.', 400);
    }

    const previousRole = user.role;
    user.role = role;
    await user.save();

    await logAudit({
      actorUserId: req.user._id,
      action: 'USER_ROLE_CHANGE',
      entityType: 'User',
      entityId: user._id,
      metadata: { targetEmail: user.email, previousRole, newRole: role }
    });

    return successResponse(res, user, `User role changed from ${previousRole} to ${role}.`);
  } catch (err) {
    next(err);
  }
};
