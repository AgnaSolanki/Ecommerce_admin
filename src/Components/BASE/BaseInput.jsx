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
  formik = {},
  disabled = false,
  showPasswordToggle = false,
  passwordShown = false,
  setPasswordShown = () => {},
  options = [],
}) => {
  const touched = formik?.touched?.[name];
  const error = formik?.errors?.[name];
  const value = formik?.values?.[name] || "";
  const isInvalid = touched && error;

  const inputType = showPasswordToggle
    ? passwordShown
      ? "text"
      : "password"
    : type;

  return (
    <div className="mb-3">
      {label && (
        <Label htmlFor={id} className="form-label">
          {label}
        </Label>
      )}

      <div className="position-relative auth-pass-inputgroup mb-3">
        {type === "select" ? (
          <Input
            id={id}
            name={name}
            type="select"
            disabled={disabled}
            className="form-select"
            value={value}
            onChange={formik?.handleChange}
            onBlur={formik?.handleBlur}
            invalid={!!isInvalid}
          >
            {options.map((opt, index) => (
              <option key={index} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Input>
        ) : (
          <InputGroup className={isInvalid ? "is-invalid" : ""}>
            <Input
              id={id}
              name={name}
              type={inputType}
              placeholder={placeholder}
              disabled={disabled}
              className="form-control"
              onChange={formik?.handleChange}
              onBlur={formik?.handleBlur}
              value={value}
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
        )}
        {isInvalid && (
          <FormFeedback className="d-block">{error}</FormFeedback>
        )}
      </div>
    </div>
  );
};

export default BaseInput;
