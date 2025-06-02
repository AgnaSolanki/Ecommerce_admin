import authApi from "./authApi";

import { LOGIN, VERIFY_EMAIL, UPDATE_PASSWORD  } from "./apiRoutes";

const authService = {
  login: (data) => authApi.post(LOGIN, data),
  sendOtpToEmail: (email) =>
    authApi.post(VERIFY_EMAIL, { email }),
  forgotPassword: (data) =>
    authApi.put(UPDATE_PASSWORD, data),
};

export default authService;
