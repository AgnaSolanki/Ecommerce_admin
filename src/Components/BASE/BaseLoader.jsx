import { Spinner } from "reactstrap";
const BaseLoader = ({ size = "sm" }, className) => {
  return <Spinner size={size} className={className} />;
};
export default BaseLoader;