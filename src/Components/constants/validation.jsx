export const validationField = (field) => ({
  required: `${field} is required.`,
  otpNumber: `${field} must be a number conforming to the specified constraints.`,
  passwordMinLength: `${field} should be at least 8 characters.`,
  passwordComplexity: `${field} should include uppercase, lowercase, one number, and one special character.`,
  passwordsMatch: (fieldName, confirmFieldName) =>
    `${
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1).toLowerCase()
    } and ${confirmFieldName.toLowerCase()} should be same.`,
  maxLength: (fieldName, max) => `${fieldName} only should be ${max} long.`,
  format: (fieldName) => `${fieldName} should be in correct format.`,
  minLength: (field, min) =>
    `${field} must be at least ${min} characters long.`,
  fixLength:(field, min) =>
    `${field} should be ${min} digit..`,
});

export const emailRegex = /^(?!.*\s)[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
export const otpRegex = /^\d{0,6}$/;
export const onlyNum = /^[0-9\b]+$/;
export const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const isNumber = (fieldName) => {
  return `${fieldName} must be is number`;
};

export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const otpLength = /^\d{6}$/;
export const phoneNumberRegex = /^[0-9]{0,10}$/;
export const postalCodeRegex = /^\d{0,6}$/;
export const inputField = (fieldName) => {
  return `Enter ${fieldName.toLowerCase()}`;
};
export const selectLabel = (fieldName) => {
  return `Select ${fieldName}`;
};
