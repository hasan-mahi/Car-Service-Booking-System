// utils/errorHandler.js

/**
 * Extracts user-friendly message from Axios or generic errors.
 * @param {any} error - The error object (e.g. Axios error)
 * @returns {string} User-friendly error message
 */
export function getErrorMessage(error) {
  if (!error) return "An unknown error occurred";

  if (error.response && error.response.data && error.response.data.error) {
    return error.response.data.error;
  }

  if (error.message) {
    return error.message;
  }

  return String(error);
}

/**
 * Handles API or other errors consistently.
 * @param {any} error - Error object caught in try-catch
 * @param {object} options - Optional configs
 * @param {boolean} options.showAlert - Show alert popup? Default false
 * @param {boolean} options.logErrors - Log errors to console? Default true except for 401
 * @param {number[]} options.silentStatusCodes - HTTP status codes to silently ignore logs (default [401])
 * @returns {string} User-friendly error message
 */
export function handleApiError(
  error,
  {
    showAlert = false,
    logErrors = true,
    silentStatusCodes = [401],
  } = {}
) {
  const status = error?.response?.status;

  if (logErrors && !silentStatusCodes.includes(status)) {
    console.error("API Error:", error);
  }

  const message = getErrorMessage(error);

  if (showAlert && message) {
    alert(message);
  }

  return message;
}
