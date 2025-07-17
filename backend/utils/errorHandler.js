/**
 * Async handler wrapper for Express routes
 * Automatically catches async errors and passes them to next()
 */
function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Centralized error response handler for Express
 * Usage: call this inside your global error middleware
 *
 * Customize error codes and messages here as needed.
 */
function handleError(res, error, customMessages = {}) {
  console.error(error); // Log the error (you can replace with a logger)

  let status = 500;
  let message = customMessages.default || "Internal Server Error";

  // Customize error based on code/type
  if (error.code === "23505") {
    status = 400;
    message = customMessages.duplicate || "Duplicate entry detected";
  } else if (error.name === "ValidationError") {
    status = 400;
    message = customMessages.validation || error.message || "Validation error";
  } else if (error.status) {
    // If error has explicit HTTP status (custom thrown error)
    status = error.status;
    message = error.message || message;
  } else if (error.message) {
    message = error.message;
  }

  res.status(status).json({ error: message });
}

module.exports = {
  asyncHandler,
  handleError,
};
