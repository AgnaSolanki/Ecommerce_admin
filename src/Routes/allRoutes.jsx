import { Navigate } from "react-router-dom";
import DashboardEcommerce from "../pages/DashboardEcommerce";
import { LoginRoutes } from "./apiRoutes";
import Login from "../pages/Authentication/Login";
import ForgetPasswordPage from "../pages/Authentication/ForgetPasswordPage";
import UserProfile from "../pages/Authentication/user-profile";

const authProtectedRoutes = [
  { path: LoginRoutes.DASHBOARD_ROUTE, element: DashboardEcommerce },
  { path: LoginRoutes.PROFILE, element: UserProfile },
  {
    path: LoginRoutes.HOME,
    exact: true,
    element: <Navigate to={LoginRoutes.LOGIN} />,
  },
  { path: "*", element: <Navigate to={LoginRoutes.LOGIN} /> },
  { path: "*", element: <Navigate to={LoginRoutes.LOGIN} /> },
];
const publicRoutes = [
  { path: LoginRoutes.LOGIN, element: Login },
  { path: LoginRoutes.RESET, element: ForgetPasswordPage },
];

export { authProtectedRoutes, publicRoutes };
