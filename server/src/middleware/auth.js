import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';
import { errorResponse } from '../utils/apiResponse.js';

export const authenticate = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return errorResponse(res, 'Authentication required. Please log in.', 401);
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) {
      return errorResponse(res, 'Invalid or expired session. Please log in again.', 401);
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return errorResponse(res, 'User account no longer exists.', 401);
    }

    if (!user.isActive) {
      return errorResponse(res, 'Your account has been deactivated. Please contact the library administrator.', 403);
    }

    req.user = user;
    next();
  } catch (err) {
    return errorResponse(res, 'Authentication error: ' + err.message, 401);
  }
};

export const optionalAuthenticate = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      const decoded = verifyToken(token);
      if (decoded && decoded.id) {
        const user = await User.findById(decoded.id);
        if (user && user.isActive) {
          req.user = user;
        }
      }
    }
  } catch (err) {
    // Optional auth silently continues
  }
  next();
};
