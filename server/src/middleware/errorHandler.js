import { errorResponse } from '../utils/apiResponse.js';

export const notFoundHandler = (req, res, next) => {
  return errorResponse(res, `Route not found - ${req.method} ${req.originalUrl}`, 404);
};

export const errorHandler = (err, req, res, next) => {
  console.error('[Unhandled Server Error]', err);

  // Mongoose duplicate key error (E11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const value = err.keyValue ? err.keyValue[field] : '';
    return errorResponse(res, `Duplicate entry: '${field}' with value '${value}' already exists.`, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(val => val.message);
    return errorResponse(res, `Validation error: ${errors.join(', ')}`, 400, errors);
  }

  // Mongoose bad ObjectId / CastError
  if (err.name === 'CastError') {
    return errorResponse(res, `Invalid resource identifier: ${err.value}`, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Invalid security token.', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Session token has expired. Please sign in again.', 401);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  return errorResponse(res, message, statusCode);
};
