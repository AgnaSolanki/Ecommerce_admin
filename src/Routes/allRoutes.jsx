import React from "react";
import { Navigate } from "react-router-dom";

import DashboardEcommerce from "../pages/DashboardEcommerce";
import Logout from "../pages/Authentication/Logout";



//login
import Login from "../pages/Authentication/Login";

const authProtectedRoutes = [
  { path: "/dashboard", element: DashboardEcommerce },
  { path: "/index", element: DashboardEcommerce },
 
  {
    path: "/",
    exact: true,
    element: <Navigate to="/login" />,
  },
  { path: "*", element: <Navigate to="/login" /> },
];

const publicRoutes = [
  { path: "/login", element: Login },
  { path: "/logout", element: Logout },
];

export { authProtectedRoutes, publicRoutes };
