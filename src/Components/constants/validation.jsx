export const validationField = (field) => ({
  required: `${field} is required`,
  otpNumber: `${field} must be a number conforming to the specified constraints`,
  passwordPattern: `${field} must contain one capital letter and at least 8 characters long`,
  passwordsMatch: (fieldName, confirmFieldName) =>
    `${
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1).toLowerCase()
    } and ${confirmFieldName.toLowerCase()} should be same.`,
  maxLength: (fieldName, max) => `${fieldName} only should be ${max} long`,
  format: (fieldName) => `${fieldName} should be in correct format`,
  minLength: (field, min) => `${field} must be at least ${min} characters long`,
});

export const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
export const otpRegex = /^\d{6}$/;
export const otpTypeRegex = /^\d{0,6}$/;
export const postalCodeRegex = /^\d{6}$/;

export const passwordRegex = /^(?=.*[A-Z]).{8,}$/;
export const otpLength = /^\d{6}$/;
export const inputField = (fieldName) => {
  return `Enter ${fieldName.toLowerCase()}`;
};
export const selectLabel = (fieldName) =>{
  return `Select ${fieldName}`
}