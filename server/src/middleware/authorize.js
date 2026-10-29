import { errorResponse } from '../utils/apiResponse.js';

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required.', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(
        res,
        `Access denied. Requires one of the following roles: [${allowedRoles.join(', ')}]. Your current role is: ${req.user.role}`,
        403
      );
    }

    next();
  };
};
