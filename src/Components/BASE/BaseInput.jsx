import { Input, InputGroup, InputGroupText } from "reactstrap";

const BaseInput = ({
  id,
  name,
  type,
  label,
  placeholder,
  disabled = false,
  showPasswordToggle = false,
  passwordShown = false,
  onChange = () => {},
  value,
  maxLength,
  onBlur = () => {},
  required = false,
  onKeyDown = () => {},
  setPasswordShown = () => {},
}) => {
  const inputType = showPasswordToggle
    ? passwordShown
      ? "text"
      : "password"
    : type;

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
          onKeyDown={onKeyDown}
        />
        {showPasswordToggle && (
          <InputGroupText onClick={() => setPasswordShown(!passwordShown)}>
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
    </div>
  );
};

export default BaseInput;
