// src/components/Common/BaseInput.js
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
  showPasswordToggle = false,
  passwordShown = false,
  setPasswordShown = () => {},
}) => {
  const isInvalid = formik.touched[name] && formik.errors[name];
  const inputType = showPasswordToggle
    ? passwordShown
      ? "text"
      : "password"
    : type;

  return (
    <div className="mb-3">
      <Label htmlFor={id} className="form-label">
        {label}
      </Label>

      {showPasswordToggle && isInvalid ? (
        // WHEN error exists — show input group
        <div className="position-relative auth-pass-inputgroup mb-3">
          <InputGroup className="is-invalid">
            <Input
              id={id}
              name={name}
              type={inputType}
              placeholder={placeholder}
              className="form-control"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values[name] || ""}
              invalid
            />
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
          </InputGroup>
          <FormFeedback className="d-block">{formik.errors[name]}</FormFeedback>
        </div>
      ) : (
        // WHEN no error — show plain input with absolute-positioned eye
        <div className="position-relative">
          <Input
            id={id}
            name={name}
            type={inputType}
            placeholder={placeholder}
            className="form-control pe-5"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values[name] || ""}
            invalid={!!isInvalid}
          />
          {isInvalid && (
            <FormFeedback className="d-block">
              {formik.errors[name]}
            </FormFeedback>
          )}
          {  showPasswordToggle && (
            <button
              className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
              type="button"
              onClick={() => setPasswordShown(!passwordShown)}
            >
              <i
                className={
                  passwordShown
                    ? "ri-eye-off-fill align-middle"
                    : "ri-eye-fill align-middle"
                }
              />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BaseInput;
