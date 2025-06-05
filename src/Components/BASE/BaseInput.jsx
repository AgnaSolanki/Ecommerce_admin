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
  onlyNumbers = false,
  maxLength = null,
  setPasswordShown = () => {},
  options = [],
  onFileChange = null, 
  isAvatarUpload = false, 
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

  const handleChange = (e) => {
    let val = e.target.value;

    if (type === "file") {
      const file = e.target.files[0];
      if (file) {
        formik.setFieldValue(name, file);
        if (onFileChange) {
          onFileChange(file);
        }
      }
      return;
    }

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
      {label && (
        <Label htmlFor={id} className="form-label d-block">
          {label}
        </Label>
      )}

      <div className="position-relative auth-pass-inputgroup mb-3">
        {type === "radio" && Array.isArray(options) ? (
          <div className="d-flex gap-3">
            {options.map((opt, idx) => (
              <div key={idx} className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name={name}
                  id={`${name}-${opt.value}`}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={formik.handleChange}
                  disabled={disabled}
                />
                <label
                  className="form-check-label"
                  htmlFor={`${name}-${opt.value}`}
                >
                  {opt.label}
                </label>
              </div>
            ))}
            {isInvalid && (
              <FormFeedback className="d-block">{error}</FormFeedback>
            )}
          </div>
        ) : type === "select" ? (
          <Input
            id={id}
            name={name}
            type="select"
            disabled={disabled}
            className="form-select"
            value={value}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            invalid={!!isInvalid}
          >
            {options.map((opt, index) => (
              <option key={index} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Input>
        ) : type === "file" ? (
          <Input
            id={id}
            name={name}
            type="file"
            className={isAvatarUpload ? "d-none" : "form-control"}
            onChange={handleChange}
            onBlur={formik.handleBlur}
            accept="image/*"
            disabled={disabled}
          />
        ) : (
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
              value={type !== "file" ? value : undefined}
              invalid={!!isInvalid}
              accept={type === "file" ? "image/*" : undefined}
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

        {isInvalid && type !== "radio" && type !== "file" && (
          <FormFeedback className="d-block">{error}</FormFeedback>
        )}
      </div>
    </div>
  );
};

export default BaseInput;
