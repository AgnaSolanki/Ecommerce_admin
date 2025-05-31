import authApi from "./authApi";

import { LOGIN, FORGET_PASS, VERIFY_EMAIL, CHANGE_PASSWORD  } from "./apiRoutes";

const authService = {
  login: (data) => authApi.post(LOGIN, data),
  forgetPassword: (data) => authApi.post(FORGET_PASS, data),
  sendOtpToEmail: (email) =>
    authApi.post(VERIFY_EMAIL, { email }),
  changePassword: (email, otp, newPassword, confirmPassword) =>
    authApi.put(CHANGE_PASSWORD, { email, otp, newPassword, confirmPassword }),
};

export default authService;
