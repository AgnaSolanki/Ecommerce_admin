import apiService from "./apiService";
import apiRoutes from "./apiRoutes";

const userApi = {
  loginUser: (credentials) => apiService.post(apiRoutes.login, credentials),
};

export default userApi;
