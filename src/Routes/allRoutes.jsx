import React from "react";
import { Navigate } from "react-router-dom";

import DashboardEcommerce from "../pages/DashboardEcommerce";

//login
import Login from "../pages/Authentication/Login";

const authProtectedRoutes = [
  { path: "/dashboard", element: DashboardEcommerce },
  { path: "/index", element: DashboardEcommerce },

  {
    path: "/",
    exact: true,
    element: <Navigate to="/dashboard" />,
  },
  { path: "*", element: <Navigate to="/dashboard" /> },
];

const publicRoutes = [{ path: "/login", element: Login }];

export { authProtectedRoutes, publicRoutes };
