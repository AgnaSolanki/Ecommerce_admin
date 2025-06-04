import authApi from "./authApi";

import { LOGIN, VERIFY_EMAIL, UPDATE_PASSWORD, UPDATE_PROFILE  } from "./apiRoutes";

const authService = {
  login: (data) => authApi.post(LOGIN, data),
  verifyEmail: (email) =>
    authApi.post(VERIFY_EMAIL, { email }),
  forgotPassword: (data) =>
    authApi.put(UPDATE_PASSWORD, data),
   updateProfile: (data) => authApi.put(UPDATE_PROFILE, data),
};

export default authService;