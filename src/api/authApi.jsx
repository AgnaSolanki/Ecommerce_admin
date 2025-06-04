// src/api/apiService.js
import axios from "axios";

const apiService = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  headers: {
    "Content-Type": "application/json",
  },
});

apiService.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiService;
