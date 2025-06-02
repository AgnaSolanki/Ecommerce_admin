import apiService from "./apiServices";
import { LOGIN_ROUTE, VERIFY_EMAIL, UPDATE_PASSWORD } from "./apiRoutes";

const userApi = {
  loginUser: (credentials) => apiService.post(LOGIN_ROUTE, credentials),
  verifyEmail: (data) => apiService.post(VERIFY_EMAIL, data),
  forgotPassword: (data) =>
    apiService.put(UPDATE_PASSWORD, data),
};

export default userApi;
