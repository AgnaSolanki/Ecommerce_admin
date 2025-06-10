import { Input, Label, FormFeedback } from "reactstrap";

const BaseSelectInput = ({
  id,
  name,
  label,
  formik,
  disabled = false,
  options = [],
  value,
  onChange,
}) => {
  const inputId = id || `input-${name}`;
  const isFormik = !!formik;

  const touched = formik?.touched?.[name];
  const error = formik?.errors?.[name];
  const isInvalid = touched && error;

  return (
    <div className="mb-3">
      {label && (
        <Label htmlFor={inputId} className="form-label d-block">
          {label}
        </Label>
      )}
      <Input
        id={inputId}
        name={name}
        type="select"
        disabled={disabled}
        className="form-select"
        value={isFormik ? formik.values?.[name] : value}
        onChange={isFormik ? formik.handleChange : onChange}
        onBlur={isFormik ? formik.handleBlur : undefined}
        invalid={!!isInvalid}
      >
        {options.map((opt, index) => (
          <option key={index} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Input>
      {isInvalid && <FormFeedback className="d-block">{error}</FormFeedback>}
    </div>
  );
};


export default BaseSelectInput;
