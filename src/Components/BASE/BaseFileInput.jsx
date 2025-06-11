import React from "react";
import { Input, Label, FormFeedback } from "reactstrap";

const BaseFileInput = ({
  id,
  name,
  label,
  formik = {},
  disabled = false,
  onFileChange = null,
  isAvatarUpload = false,
}) => {
  const touched = formik?.touched?.[name];
  const error = formik?.errors?.[name];
  const isInvalid = touched && error;
const inputId = id || `input-${name}`;
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      formik.setFieldValue(name, file);
      if (onFileChange) {
        onFileChange(file);
      }
    }
  };

  return (
     <div className="mb-3 position-relative">
      {label && !isAvatarUpload && (
        <Label htmlFor={inputId} className="form-label d-block">
          {label}
        </Label>
      )}

      <Input
        id={inputId}
        name={name}
        type="file"
        className={isAvatarUpload ? "d-none" : "form-control"}
        onChange={handleChange}
        onBlur={formik.handleBlur}
        accept="image/*"
        disabled={disabled}
        invalid={!!isInvalid}
      />
     

      {isInvalid && <FormFeedback className="d-block">{error}</FormFeedback>}
    </div>
  );
};

export default BaseFileInput;
