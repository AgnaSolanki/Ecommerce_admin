import React from "react";
import { Label, FormFeedback } from "reactstrap";

const BaseRadioInput = ({
  name,
  label,
  formik = {},
  disabled = false,
  options = [],
}) => {
  const touched = formik?.touched?.[name];
  const error = formik?.errors?.[name];
  const value = formik?.values?.[name] || "";
  const isInvalid = touched && error;

  return (
    <div className="mb-3">
      {label && <Label className="form-label d-block">{label}</Label>}

      <div className="d-flex gap-3">
        {options.map((opt, idx) => (
          <div key={idx} className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name={name}
              id={`${name}-${opt.value}`}
              value={opt.value}
              checked={value === opt.value}
              onChange={formik.handleChange}
              disabled={disabled}
            />
            <label className="form-check-label" htmlFor={`${name}-${opt.value}`}>
              {opt.label}
            </label>
          </div>
        ))}
      </div>

      {isInvalid && <FormFeedback className="d-block">{error}</FormFeedback>}
    </div>
  );
};

export default BaseRadioInput;
