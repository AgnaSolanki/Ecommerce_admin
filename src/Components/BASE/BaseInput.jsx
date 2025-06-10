import { Input, FormFeedback, InputGroup, InputGroupText } from "reactstrap";

const BaseInput = ({
  id,
  name,
  label,
  placeholder,
  formik = {},
  disabled = false,
  showPasswordToggle = false,
  passwordShown = false,
  onlyNumbers = false,
  maxLength = null,
  setPasswordShown = () => {},
}) => {
  const touched = formik?.touched?.[name];
  const error = formik?.errors?.[name];
  const value = formik?.values?.[name] || "";
  const isInvalid = touched && error;

  const inputType = showPasswordToggle
    ? passwordShown
      ? "text"
      : "password"
    : "text";

  const handleChange = (e) => {
    let val = e.target.value;

    if (onlyNumbers) {
      val = val.replace(/\D/g, "");
    }

    if (maxLength !== null && val.length > maxLength) {
      val = val.slice(0, maxLength);
    }

    formik.setFieldValue(name, val);
  };

  return (
    <div className="mb-3">
      {label && <label htmlFor={id} className="form-label d-block">{label}</label>}

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
          value={value}
          invalid={!!isInvalid}
        />
        {showPasswordToggle && (
          <InputGroupText
            onClick={() => setPasswordShown(!passwordShown)}
            style={{ cursor: "pointer" }}
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
