// src/api/userApi.js
import apiService from "./apiServices";
import { LOGIN_ROUTE, FORGET_PASS, CHANGE_PASSWORD } from "./apiRoutes";

const userApi = {
  loginUser: (credentials) => apiService.post(LOGIN_ROUTE, credentials),

  // ✅ Add this
  forgetPassword: (data) => apiService.post(FORGET_PASS, data),
  changePassword: (data) =>
    apiService.put(CHANGE_PASSWORD, data),
};

export default userApi;
