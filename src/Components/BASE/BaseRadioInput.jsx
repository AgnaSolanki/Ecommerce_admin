const BaseRadioInput = ({
  name,
  label,
  disabled = false,
  options = [],
  required = false,
  onChange = ()=> {},
  onBlur = ()=> {}, 
}) => {
  return (
    <div className="mb-3">
      <label className="form-label">
        {label} {required && <span className="color">*</span>}
      </label>

      <div className="d-flex gap-3">
        {options.map((opt, idx) => (
          <div key={idx} className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name={name}
              id={`${name}-${opt.value}`}
              value={opt.value}
              onChange={onChange}
              onBlur={onBlur}
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
      </div>
    </div>
  );
};

export default BaseRadioInput;
