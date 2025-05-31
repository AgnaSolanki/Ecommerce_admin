// src/api/userApi.js
import apiService from "./apiServices";
import { LOGIN_ROUTE, FORGET_PASS, CHANGE_PASSWORD } from "./apiRoutes";

const userApi = {
  loginUser: (credentials) => apiService.post(LOGIN_ROUTE, credentials),

  // ✅ Add this
  forgetPassword: (data) => apiService.post(FORGET_PASS, data),
  changePassword: ({ email, otp, newPassword, confirmPassword }) =>
    apiService.put(CHANGE_PASSWORD, { email, otp, newPassword, confirmPassword }),
};

export default userApi;
