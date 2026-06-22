// backend/middleware/errorMiddleware.js

const errorMiddleware = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // 1. Mongoose Bad ObjectId (Cast Error)
  if (err.name === 'CastError') {
    error.message = `Resource not found. Invalid ID format.`;
    res.status(400);
  }

  // 2. Mongoose Duplicate Key (Email already exists)
  if (err.code === 11000) {
    error.message = `Duplicate field value entered. Please use another value.`;
    res.status(400);
  }

  // 3. Mongoose Validation Error (Missing required fields)
  if (err.name === 'ValidationError') {
    error.message = Object.values(err.errors).map(val => val.message).join(', ');
    res.status(400);
  }

  // 4. JWT Expired Error
  if (err.name === 'TokenExpiredError') {
    error.message = `Your session has expired. Please login again.`;
    res.status(401);
  }

  res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
    success: false,
    message: error.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorMiddleware;