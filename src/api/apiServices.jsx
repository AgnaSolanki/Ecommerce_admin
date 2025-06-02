import authApi from "./authApi";

import { LOGIN } from "./apiRoutes";

const authService = {
  login: (data) => authApi.post(LOGIN, data),
};

export default authService;
