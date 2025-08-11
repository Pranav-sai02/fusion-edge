// error-messages.constants.ts
export const ERROR_MESSAGES = {
  required: 'This field is required',
  email: 'Enter a valid email address',
  passwordMismatch: 'Passwords do not match'

};

export const VALIDATION_MESSAGES = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  minLength: (min: number) => `Minimum length is ${min} characters`,
  maxLength: (max: number) => `Maximum length is ${max} characters`,
  pattern: 'Invalid format',
  passwordMismatch: 'Passwords do not match'
};
export const FORM_ERRORS = {
  general: 'There was an error processing your request. Please try again later.',
  network: 'Network error. Please check your internet connection.',
  server: 'Server error. Please contact support if the issue persists.'
};
export const AUTH_ERRORS = {
  invalidCredentials: 'Invalid username or password',
  accountLocked: 'Your account is locked. Please contact support.',
  sessionExpired: 'Your session has expired. Please log in again.',
  unauthorized: 'You do not have permission to access this resource.',
  forbidden: 'You do not have permission to perform this action.'
};

