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
  onChange = {},
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
        if (typeof onFileChange === "function") {
          onFileChange(file);
        } else {
          formik.setFieldValue(name, file);
        }
      }
    } else {
      formik.setFieldValue(name, val);
    }
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
          <>
            <Input
              id={id}
              name={name}
              type="file"
              className={isAvatarUpload ? "d-none" : "form-control"}
              onChange={onChange}
              onBlur={formik.handleBlur}
              accept="image/*"
              disabled={disabled}
            />
            {isInvalid && (
              <FormFeedback className="d-block">{error}</FormFeedback>
            )}
          </>
        ) : (
          <InputGroup className={isInvalid ? "is-invalid" : ""}>
            <Input
              id={id}
              name={name}
              type={inputType}
              placeholder={placeholder}
              disabled={disabled}
              className="form-control"
              onChange={onChange}
              onBlur={formik.handleBlur}
              value={value}
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
