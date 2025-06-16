import { Input } from "reactstrap";

const BaseFileInput = ({
  id,
  name,
  label,
  disabled = false,
  isAvatarUpload = false,
  required = false,
  onChange = ()=>{},
  onBlur = ()=>{},
  onFileChange = ()=>{}
}) => {
  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={id} className="form-label">
          {label} {required && <span className="color">*</span>}
        </label>
      )}
      <Input
        id={id}
        name={name}
        type="file"
        className={isAvatarUpload ? "d-none" : "form-control"}
        onChange={onChange}
        onBlur={onBlur}
        accept="image/*"
        disabled={disabled}
        onFileChange = {onFileChange}
      />
    </div>
  );
};

export default BaseFileInput;
