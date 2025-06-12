import React from "react";
import { Input, Label, FormFeedback } from "reactstrap";

const BaseSelectInput = ({
  id,
  name,
  label,
  formik = {},
  disabled = false,
  options = [],
  required = false,
}) => {
  const touched = formik?.touched?.[name];
  const error = formik?.errors?.[name];
  const value = formik?.values?.[name] || "";
  const isInvalid = touched && error;

  return (
    <div className="mb-3">
      {label && (
           <label className="form-label">
        {label} {required && <span className="color">*</span>}
      </label>
      
      )}
      <Input
        id={id}
        name={name}
        type="select"
        disabled={disabled}
        className="form-select"
        value={value}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        invalid={!!isInvalid}
      >
        {options.map((opt, index) => (
          <option key={index} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Input>
      {isInvalid && <FormFeedback className="d-block">{error}</FormFeedback>}
    </div>
  );
};

export default BaseSelectInput;
