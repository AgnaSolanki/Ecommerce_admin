import authApi from "./authApi";

import { LOGIN, VERIFY_EMAIL, UPDATE_PASSWORD, UPDATE_PROFILE, VIEW_PROFILE, UPLOAD_FILE, CHANGE_PASSWORD  } from "./apiRoutes";

const authService = {
  login: (data) => authApi.post(LOGIN, data),
  verifyEmail: (email) =>
    authApi.post(VERIFY_EMAIL, { email }),
  forgotPassword: (data) =>
    authApi.put(UPDATE_PASSWORD, data),
   updateProfile: (data) => authApi.put(UPDATE_PROFILE, data),
    viewProfile: () => authApi.get(VIEW_PROFILE),
     fileUpload: (file) => authApi.post(UPLOAD_FILE, file,{
       headers: {
    "Content-Type": "multipart/form-data",
  },
     }),
     changePassword: (data) => authApi.put(CHANGE_PASSWORD, data)
};

export default authService;