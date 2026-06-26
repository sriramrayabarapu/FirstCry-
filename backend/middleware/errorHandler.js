/**
 * Central Error Handler Middleware.
 * Captures all express throw statements or route rejections.
 */
module.exports = (err, req, res, next) => {
  console.error('💥 [EXPRESS CRITICAL ERROR]:', err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected internal server error occurred.';

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
};
