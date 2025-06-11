import React from "react";
import {
  Input,
  Label,
  FormFeedback,
  InputGroup,
  InputGroupText,
} from "reactstrap";

const BaseInput = ({
  id,
  name,
  label,
  type = "text",
  placeholder,
  formik,
  disabled = false,
  showPasswordToggle = false,
  passwordShown = false,
  required = false,
  setPasswordShown = () => {},
  onChange = {}
}) => {
  const isInvalid = formik.touched[name] && formik.errors[name];
  const inputType = showPasswordToggle
    ? passwordShown
      ? "text"
      : "password"
    : type;

  return (
    <div className="mb-3">
    <label htmlFor={id} className="form-label">
        {label} {required && <span className="color">*</span>}
      </label>

      <div className="position-relative auth-pass-inputgroup mb-3">
        <InputGroup className={isInvalid ? "is-invalid" : ""}>
          <Input
            id={id}
            name={name}
            type={inputType}
            placeholder={placeholder}
            disabled={disabled}
            className="form-control"
            onChange={onChange}
            onBlur={formik.handleBlur}
            value={formik.values[name] || ""}
            invalid={!!isInvalid}
          />
          {showPasswordToggle && (
            <InputGroupText
              onClick={() => setPasswordShown(!passwordShown)}
              style={{ cursor: "pointer" }}
            >
              <i
                className={
                  passwordShown
                    ? "ri-eye-off-fill align-middle"
                    : "ri-eye-fill align-middle"
                }
              />
            </InputGroupText>
          )}
        </InputGroup>
        {isInvalid && (
          <FormFeedback className="d-block">{formik.errors[name]}</FormFeedback>
        )}
      </div>
    </div>
  );
};

export default BaseInput;
