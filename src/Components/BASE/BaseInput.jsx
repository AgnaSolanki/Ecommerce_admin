import { Input, InputGroup, InputGroupText, FormFeedback, Label } from "reactstrap";

const BaseTextInput = ({
  id,
  name,
  type,
  label,
  placeholder,
  formik = {},
  disabled = false,
  showPasswordToggle = false,
  passwordShown = false,
  setPasswordShown = () => {},
}) => {
  const touched = formik?.touched?.[name];
  const error = formik?.errors?.[name];
  const isInvalid = touched && error;

  const inputType = showPasswordToggle ? (passwordShown ? "text" : "password") : type;
  const fieldProps = formik && name ? formik.getFieldProps(name) : {};
  const inputId = id || `input-${name}`;

  return (
    <div className="mb-3">
      {label && (
        <Label htmlFor={inputId} className="form-label d-block">
          {label}
        </Label>
      )}
      <InputGroup className={isInvalid ? "is-invalid" : ""}>
        <Input
          id={inputId}
          name={name}
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          className="form-control"
          {...fieldProps}
          invalid={!!isInvalid}
          autoComplete="off"
        />
        {showPasswordToggle && (
          <InputGroupText onClick={() => setPasswordShown(!passwordShown)} style={{ cursor: "pointer" }}>
            <i className={passwordShown ? "ri-eye-off-fill align-middle" : "ri-eye-fill align-middle"} />
          </InputGroupText>
        )}
      </InputGroup>
      {isInvalid && <FormFeedback className="d-block">{error}</FormFeedback>}
    </div>
  );
};

export default BaseTextInput;
