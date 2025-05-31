import { Navigate } from "react-router-dom";
import DashboardEcommerce from "../pages/DashboardEcommerce";
import { LoginRoutes } from "./Constant";
import Login from "../pages/Authentication/Login";
import ForgetPasswordPage from "../pages/Authentication/ForgetPasswordPage";

const authProtectedRoutes = [
  { path: LoginRoutes.DASHBOARD_ROUTE, element: DashboardEcommerce },
  { path: LoginRoutes.INDEX, element: DashboardEcommerce },
  {
    path: LoginRoutes.HOME,
    exact: true,
    element: <Navigate to={LoginRoutes.HOME} />,
  },
  { path: "*", element: <Navigate to={LoginRoutes.HOME} /> },
];
const publicRoutes = [
  { path: LoginRoutes.LOGIN, element: Login },
  { path: LoginRoutes.FORGET_PASSWORD, element: ForgetPasswordPage },
];

export { authProtectedRoutes, publicRoutes };
