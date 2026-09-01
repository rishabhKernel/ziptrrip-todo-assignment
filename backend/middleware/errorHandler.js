/**
 * Central error handling middleware.
 * Catches any errors thrown in route handlers (via next(err)).
 */
function errorHandler(err, req, res, next) {
  console.error('[Error]', err.message || err);

  const status = err.status || err.statusCode || 500;
  const message = status < 500 ? err.message : 'An internal server error occurred.';

  res.status(status).json({
    success: false,
    message,
  });
}

/**
 * 404 handler for unmatched routes.
 */
function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

module.exports = { errorHandler, notFoundHandler };
