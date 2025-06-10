import { Input, Label, FormFeedback } from "reactstrap";

const BaseFileInput = ({
  id,
  name,
  label,
  formik = {},
  disabled = false,
  isAvatarUpload = false,
  onFileChange,
}) => {
  const touched = formik?.touched?.[name];
  const error = formik?.errors?.[name];
  const isInvalid = touched && error;

  const inputId = id || `input-${name}`;

  return (
    <div className="mb-3 position-relative">
      {label && !isAvatarUpload && (
        <Label htmlFor={inputId} className="form-label d-block">
          {label}
        </Label>
      )}

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

      {isAvatarUpload && (
        <label htmlFor={inputId} className="position-absolute img-avatar" style={{ cursor: "pointer" }}>
          <i className="ri-edit-2-line" />
        </label>
      )}

      {isInvalid && <FormFeedback className="d-block">{error}</FormFeedback>}
    </div>
  );
};

export default BaseFileInput;
