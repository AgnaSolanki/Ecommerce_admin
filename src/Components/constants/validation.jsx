export const validationField = (field) => ({
  required: `${field} is required`,
  otpNumber: `${field} must be a number conforming to the specified constraints`,
  passwordPattern: `${field}  must contain at least one uppercase letter, one number, one special character, and at least 8 character long`,
  passwordsMatch: (fieldName, confirmFieldName) =>
    `${
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1).toLowerCase()
    } and ${confirmFieldName.toLowerCase()} should be same.`,
  maxLength: (fieldName, max) => `${fieldName} only should be ${max} long`,
  format: (fieldName) => `${fieldName} should be in correct format`,
  minLength: (field, min) => `${field} must be at least ${min} characters long`,
});

export const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
export const otpRegex = /^\d{0,6}$/;
export const onlyNum = /^[0-9\b]+$/;




export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const otpLength = /^\d{6}$/;
export const postalCodeRegex = /^\d{6}$/;
export const inputField = (fieldName) => {
  return `Enter ${fieldName.toLowerCase()}`;
};
export const selectLabel = (fieldName) =>{
  return `Select ${fieldName}`
}

export const isNumber = (fieldName) =>{
   return `${fieldName} must be is number`
}