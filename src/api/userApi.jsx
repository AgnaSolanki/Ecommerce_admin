import apiService from "./authApi";
import {
  LOGIN,
  VERIFY_EMAIL,
  UPDATE_PASSWORD,
  UPDATE_PROFILE,
  CITY,
  COUNTRY,
  STATE,
} from "./apiRoutes";

const userApi = {
  loginUser: (credentials) => apiService.post(LOGIN, credentials),
  verifyEmail: (data) => apiService.post(VERIFY_EMAIL, data),
  forgotPassword: (data) => apiService.put(UPDATE_PASSWORD, data),
  updateProfile: (data) => apiService.put(UPDATE_PROFILE, data),
  getCountries: () => apiService.get(COUNTRY),
  getStates: (countryId) =>
    apiService.get(STATE.replace("{country_id}", countryId)),
  getCities: (stateId) => apiService.get(CITY.replace("{state_id}", stateId)),
  // ...other methods
};

export default userApi;
