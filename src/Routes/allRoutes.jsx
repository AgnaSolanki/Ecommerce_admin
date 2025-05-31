import React, { Component } from "react";
import { Navigate } from "react-router-dom";

import DashboardEcommerce from "../pages/DashboardEcommerce";
import Logout from "../pages/Authentication/Logout";
import ForgetPasswordPage from "../pages/Authentication/ForgetPasswordPage";

import {
  LOGIN_ROUTE,
  LOGOUT_ROUTE,
  DASHBOARD_ROUTE,
  HOME,
  INDEX,
  FORGET_PASS_ROUTE,
} from "../api/apiRoutes";

//login
import Login from "../pages/Authentication/Login";

const authProtectedRoutes = [
  { path: DASHBOARD_ROUTE, element: DashboardEcommerce },
  { path: INDEX, element: DashboardEcommerce },

  {
    path: HOME,
    exact: true,
    element: <Navigate to={LOGIN_ROUTE} />,
  },
  { path: "*", element: <Navigate to={LOGIN_ROUTE} /> },
];

const publicRoutes = [
  { path: LOGIN_ROUTE, element: Login },
  { path: LOGOUT_ROUTE, element: Logout },
  { path: "/forgot-password", element: ForgetPasswordPage },
];

export { authProtectedRoutes, publicRoutes };
