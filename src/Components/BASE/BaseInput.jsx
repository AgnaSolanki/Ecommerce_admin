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
  placeholder,
  formik = {},
  disabled = false,
  showPasswordToggle = false,
  passwordShown = false,
 onChange = () => {},
   type,
  value,
  onBlur=() => {},
  required = false,
  setPasswordShown = () => {},
}) => {
  const touched = formik?.touched?.[name];
  const error = formik?.errors?.[name];
  const isInvalid = touched && error;

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

      <InputGroup className={isInvalid ? "is-invalid" : ""}>
        <Input
          id={id}
          name={name}
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          className="form-control"
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          invalid={!!isInvalid}
        />
        {showPasswordToggle && (
          <InputGroupText
            onClick={() => setPasswordShown(!passwordShown)}
          >
            <i
              className={passwordShown ? "ri-eye-off-fill align-middle" : "ri-eye-fill align-middle"}
            />
          </InputGroupText>
        )}
      </InputGroup>

      {isInvalid && <FormFeedback className="d-block">{error}</FormFeedback>}
    </div>
  );
};

export default BaseInput;
