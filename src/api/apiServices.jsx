import authApi from "./authApi";

import { LOGIN, FORGET_PASS, VERIFY_EMAIL, CHANGE_PASSWORD  } from "./apiRoutes";

const authService = {
  login: (data) => authApi.post(LOGIN, data),
  forgetPassword: (data) => authApi.post(FORGET_PASS, data),
  sendOtpToEmail: (email) =>
    authApi.post(VERIFY_EMAIL, { email }),
  changePassword: (data) =>
    authApi.put(CHANGE_PASSWORD, data),
};

export default authService;
