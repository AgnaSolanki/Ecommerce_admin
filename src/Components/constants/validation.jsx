export const validation = (field) => ({
  required: `${field} is required`,
  requiredConfirm: `Confirm Password must be the same as New Password`,

  invalidEmail: `${field} should be in correct format.`,
  minLength: (min) => `${field} must be at least ${min} characters long`,
  otpRequired: `${field} should not be empty`,
  otpNumber: `${field} must be a number conforming to the specified constraints`,
  passwordPattern: `${field} must contain one capital letter and at least 8 characters long`,
  passwordsMustMatch: `Passwords must match`,
});
export const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
export const otpRegex = /^\d{6}$/;
export const passwordRegex = /^(?=.*[A-Z]).{8,}$/;

export const inputField = (fieldName) => {
  return `Enter ${fieldName.toLowerCase()}`;
};