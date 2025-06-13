import React from "react";
import { Input, Label, FormFeedback } from "reactstrap";

const BaseSelectInput = ({
  id,
  name,
  label,
  onChange = () => {},
  onBlur = () => {},
  disabled = false,
  options = [],
  required = false,
  value,
}) => {
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
        onChange={onChange}
        onBlur={onBlur}
      >
        {options.map((opt, index) => (
          <option key={index} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Input>
    </div>
  );
};

export default BaseSelectInput;
