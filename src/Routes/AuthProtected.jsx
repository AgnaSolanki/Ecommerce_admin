// components/AuthProtected.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { LoginRoutes } from "./Routes";

const AuthProtected = () => {
  const token = sessionStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to={LoginRoutes.LOGIN} replace />;
};
export default AuthProtected;
