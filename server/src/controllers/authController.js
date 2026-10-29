import User from '../models/User.js';
import { signToken } from '../utils/jwt.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { ROLES } from '../config/constants.js';
import { logAudit } from '../utils/auditLogger.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, studentId, department } = req.body;

    if (!name || !email || !password) {
      return errorResponse(res, 'Please provide name, email, and password.', 400);
    }

    if (password.length < 6) {
      return errorResponse(res, 'Password must be at least 6 characters.', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check existing email
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return errorResponse(res, 'An account with this email already exists.', 400);
    }

    // Check studentId uniqueness if provided
    if (studentId) {
      const existingId = await User.findOne({ studentId: studentId.trim() });
      if (existingId) {
        return errorResponse(res, 'A student with this Student ID is already registered.', 400);
      }
    }

    const passwordHash = await User.hashPassword(password);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: ROLES.STUDENT, // Public registration is strictly STUDENT role
      studentId: studentId ? studentId.trim() : undefined,
      department: department ? department.trim() : undefined,
      isActive: true
    });

    const token = signToken({ id: user._id, role: user.role });

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    });

    await logAudit({
      actorUserId: user._id,
      action: 'USER_REGISTER',
      entityType: 'User',
      entityId: user._id,
      metadata: { email: user.email, role: user.role }
    });

    return successResponse(res, { user, token }, 'Registration successful.', 201);
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Please enter email and password.', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return errorResponse(res, 'Invalid email or password.', 401);
    }

    if (!user.isActive) {
      return errorResponse(res, 'Your account has been deactivated. Please contact the librarian.', 403);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid email or password.', 401);
    }

    const token = signToken({ id: user._id, role: user.role });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    });

    await logAudit({
      actorUserId: user._id,
      action: 'USER_LOGIN',
      entityType: 'User',
      entityId: user._id,
      metadata: { email: user.email, role: user.role }
    });

    return successResponse(res, { user, token }, 'Signed in successfully.');
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res) => {
  res.clearCookie('token');
  return successResponse(res, null, 'Signed out successfully.');
};

export const getMe = async (req, res) => {
  return successResponse(res, { user: req.user }, 'Current user profile fetched.');
};
