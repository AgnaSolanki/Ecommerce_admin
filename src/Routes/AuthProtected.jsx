// components/AuthProtected.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AuthProtected = () => {
  const token = sessionStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AuthProtected;
