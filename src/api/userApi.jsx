import authApi from "./authApi";
import {
  LOGIN,
  VERIFY_EMAIL,
  UPDATE_PASSWORD,
  UPDATE_PROFILE,
  CITY,
  COUNTRY,
  STATE,
  VIEW_PROFILE,
} from "./apiRoutes";

const userApi = {
  loginUser: (credentials) => authApi.post(LOGIN, credentials),
  verifyEmail: (data) => authApi.post(VERIFY_EMAIL, data),
  forgotPassword: (data) => authApi.put(UPDATE_PASSWORD, data),
  updateProfile: (data) => authApi.put(UPDATE_PROFILE, data),
  getCountries: () => authApi.get(COUNTRY),
  getStates: (countryId) =>
    authApi.get(STATE.replace("{country_id}", countryId)),
  getCities: (stateId) => authApi.get(CITY.replace("{state_id}", stateId)),
  viewProfile: () => authApi.get(VIEW_PROFILE),
  fileUpload: (file) => {
    const formData = new FormData();
    formData.append("files", file);

    return authApi.post("/fileUpload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default userApi;
