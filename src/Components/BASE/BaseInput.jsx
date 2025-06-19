import { Input, InputGroup, InputGroupText } from "reactstrap";

const BaseInput = ({
  id,
  name,
  label,
  placeholder,
  disabled = false,
  showPasswordToggle = false,
  passwordShown = false,
  onChange = () => {},
   type,
  value,
  maxLength,
  onBlur = () => {},
  required = false,
  setPasswordShown = () => {},
}) => {
  const inputType = showPasswordToggle
    ? passwordShown
      ? "text"
      : "password"
    : type;
  const handleKeyDown = (event) => {
    const preventTypes = ["email", "password"];
    if (preventTypes.includes(inputType) && event.code === "Space") {
      event.preventDefault();
    }
  };

  return (
    <div>
      <label htmlFor={id} className="form-label">
        {label} {required && <span className="color">*</span>}
      </label>

      <InputGroup>
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
          maxLength={maxLength}
          onKeyDown={handleKeyDown}
        />
        {showPasswordToggle && (
          <InputGroupText onClick={() => setPasswordShown(!passwordShown)}>
            <i
              className={
                passwordShown
                  ? "ri-eye-fill align-middle"
                  : "ri-eye-off-fill align-middle"
              }
            />
          </InputGroupText>
        )}
      </InputGroup>
    </div>
  );
};

export default BaseInput;
