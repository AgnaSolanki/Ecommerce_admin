import { Navigate } from "react-router-dom";
import DashboardEcommerce from "../pages/DashboardEcommerce";
import { LoginRoutes } from "./apiRoutes";
import Login from "../pages/Authentication/Login";
import ForgetPasswordPage from "../pages/Authentication/ForgetPasswordPage";
import UserProfile from "../pages/Authentication/user-profile";
import ChangePassword from "../pages/DashboardEcommerce/ChangePassword"
import ProductList from "../pages/DashboardEcommerce/Product/ProductList";
import AddProduct from "../pages/DashboardEcommerce/Product/AddProduct";
import ViewProduct from "../pages/DashboardEcommerce/Product/ViewProduct"
import EditProduct from "../pages/DashboardEcommerce/Product/EditProduct"
import CategoryList from "../pages/DashboardEcommerce/Category/CategoryList"
import Dashboard from "../pages/DashboardEcommerce/Dashboard/Dashboard";
import Report from "../pages/DashboardEcommerce/Report/Report"

const authProtectedRoutes = [
  { path: LoginRoutes.DASHBOARD_ROUTE, element: DashboardEcommerce },
  { path: LoginRoutes.PROFILE, element: UserProfile },
  { path: LoginRoutes.CHANGE_PASSWORD, element: ChangePassword  },
  { path: LoginRoutes.PRODUCT_LIST, element: ProductList  },
  { path: LoginRoutes.ADD_PRODUCT, element: AddProduct  },
  { path: `${LoginRoutes.VIEW_PRODUCT}/:id`, element: ViewProduct  },
  { path: `${LoginRoutes.EDIT_PRODUCT}/:id`, element: EditProduct  },
  { path: LoginRoutes.CATEGORY_LIST, element: CategoryList  },
  {path: LoginRoutes.MAIN_DASHBOARD, element: Dashboard},
  {path: LoginRoutes.REPORT, element: Report},


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
