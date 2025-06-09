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
  isAvatarUpload = false,
  onFileChange,
  options = [],
}) => {
  const touched = formik?.touched?.[name];
  const error = formik?.errors?.[name];
  const isInvalid = touched && error;

  const inputType = showPasswordToggle
    ? passwordShown
      ? "text"
      : "password"
    : type;

  const fieldProps =
    formik && name && type !== "file" ? formik.getFieldProps(name) : {};

  const inputId = id || `input-${name}`;

  return (
    <div className="mb-3">
      {label && !isAvatarUpload && (
        <Label htmlFor={inputId} className="form-label d-block">
          {label}
        </Label>
      )}

      <div className="position-relative auth-pass-inputgroup mb-3">
        {/* Radio Input */}
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
                  checked={formik.values?.[name] === opt.value}
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
            id={inputId}
            name={name}
            type="select"
            disabled={disabled}
            className="form-select"
            value={formik.values?.[name] || ""}
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
          <>
            {/* Hidden input for avatar-style uploads */}
            <Input
              id={inputId}
              name={name}
              type="file"
              className={isAvatarUpload ? "d-none" : "form-control"}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file && typeof onFileChange === "function") {
                  onFileChange(file);
                } else if (file && formik.setFieldValue) {
                  formik.setFieldValue(name, file);
                }
              }}
              onBlur={formik.handleBlur}
              accept="image/*"
              disabled={disabled}
            />

            {/* Avatar upload label as trigger */}
            {isAvatarUpload && (
              <label
                htmlFor={inputId}
                className="position-absolute img-avatar"
                style={{ cursor: "pointer" }}
              >
                <i className="ri-edit-2-line" />
              </label>
            )}

            {isInvalid && (
              <FormFeedback className="d-block">{error}</FormFeedback>
            )}
          </>
        ) : (
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
