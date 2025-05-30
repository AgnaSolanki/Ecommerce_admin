// src/components/Common/BaseButton.js
import React from "react";
import { Button} from "reactstrap";
import BaseLoader from "./BaseLoader";

const BaseButton = ({
  type = "button",
  color = "primary",
  block = false,
  loading = false,
  disabled = false,
  onClick = () => {},
  children,
  className = "",
}) => {
  return (
    <Button
      type={type}
      color={color}
      className={`${block ? "w-100" : ""} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
     {loading && <BaseLoader className="me-2" />}
      {children}
    </Button>
  );
};

export default BaseButton;
