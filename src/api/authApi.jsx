import axios from "axios";
import apiService from "./apiServices";

const authApi = axios.create({
  baseURL: apiService.baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

authApi.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default authApi;