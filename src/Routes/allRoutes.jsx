import React from "react";
import { Navigate } from "react-router-dom";
import DashboardEcommerce from "../pages/DashboardEcommerce";
import { LoginRoutes } from "./Constant";
import Login from "../pages/Authentication/Login";

const authProtectedRoutes = [
  { path: LoginRoutes.DASHBOARD_ROUTE, element: DashboardEcommerce },
  { path: LoginRoutes.INDEX, element: DashboardEcommerce },
  {
    path: LoginRoutes.HOME,
    exact: true,
    element: <Navigate to={LoginRoutes.LOGIN} />,
  },
  { path: "*", element: <Navigate to={LoginRoutes.LOGIN} /> },
];
const publicRoutes = [{ path: LoginRoutes.LOGIN, element: Login }];

export { authProtectedRoutes, publicRoutes };
