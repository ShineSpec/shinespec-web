/**
 * Formats error messages to be user-friendly
 */
export const formatErrorMessage = (error) => {
  // Handle network errors
  if (!error.response) {
    return "Unable to connect to the server. Please check your internet connection and try again.";
  }

  const status = error.response.status;
  const message = error.response?.data?.message || "";
  const data = error.response?.data || {};

  // Handle specific error messages from backend
  if (message) {
    // Make common error messages more user-friendly
    const friendlyMessages = {
      "Token expired": "Your session has expired. Please log in again.",
      "Token expired. Please log in again.": "Your session has expired. Please log in again.",
      "No token provided": "Please log in to continue.",
      "Invalid token": "Your session is invalid. Please log in again.",
      "Email already registered": "This email is already registered. Please use a different email or try logging in.",
      "User not found": "No account found with this email. Please check your email or sign up.",
      "Invalid password": "The password you entered is incorrect. Please try again.",
      "Password must be at least 6 characters": "Password must be at least 6 characters long.",
      "All fields are required": "Please fill in all required fields.",
      "Invalid email format": "Please enter a valid email address.",
    };

    if (friendlyMessages[message]) {
      return friendlyMessages[message];
    }

    // Return the message if it's already user-friendly
    return message;
  }

  // Handle HTTP status codes
  switch (status) {
    case 400:
      return "Please check your input and try again.";
    case 401:
      return "Your session has expired. Please log in again.";
    case 403:
      return "You don't have permission to perform this action.";
    case 404:
      return "The requested resource was not found.";
    case 409:
      return "This information already exists. Please use different details.";
    case 422:
      return "Please check your input and try again.";
    case 500:
      return "Something went wrong on our end. Please try again later.";
    case 503:
      return "Service is temporarily unavailable. Please try again later.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
};

/**
 * Formats validation errors from backend
 */
export const formatValidationErrors = (errors) => {
  if (typeof errors === 'string') {
    return errors;
  }

  if (Array.isArray(errors)) {
    return errors.join(', ');
  }

  if (typeof errors === 'object') {
    return Object.values(errors).join(', ');
  }

  return "Please check your input and try again.";
};



