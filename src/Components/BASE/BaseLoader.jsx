import { Spinner } from "reactstrap";
const BaseLoader = ({ size = "sm" }, className) => {
  return <Spinner size={size} className={className} />;
};
export default BaseLoader;

export const BigBaseLoader = ({ size = "lg", className = "" }) => {
  return (
    <div
      className={`d-flex justify-content-center align-items-center w-100 h-100 ${className}`}
      style={{ minHeight: 300 }}
    >
      <Spinner size={size} color="primary" style={{ width: 80, height: 80 }} />
    </div>
  );
};
