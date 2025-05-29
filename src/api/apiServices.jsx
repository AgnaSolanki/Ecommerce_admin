import authApi from "./authApi";

import { LOGIN, LOGOUT } from "./apiRoutes";

const authService = {
  login: (data) => authApi.post(LOGIN, data),
};

export const logout = () => {
  sessionStorage.removeItem("token");
  return Promise.resolve();
};
export default authService;
