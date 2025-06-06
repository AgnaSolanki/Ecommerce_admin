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
  setPasswordShown = () => {},
   isOtp = false,
}) => {
  const isInvalid = formik.touched[name] && formik.errors[name];
  const inputType = showPasswordToggle
    ? passwordShown
      ? "text"
      : "password"
    : type;

  const handleChange = (e) => {
    let val = e.target.value;

     if (isOtp) {
      val = val.replace(/\D/g, "").slice(0, 6);
    }
    formik.setFieldValue(name, val);
  };

  return (
    <div className="mb-3">
      <Label htmlFor={id} className="form-label">
        {label}
      </Label>

      <div className="position-relative auth-pass-inputgroup mb-3">
        <InputGroup className={isInvalid ? "is-invalid" : ""}>
          <Input
            id={id}
            name={name}
            type={inputType}
            placeholder={placeholder}
            disabled={disabled}
            className="form-control"
            onChange={handleChange}
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
