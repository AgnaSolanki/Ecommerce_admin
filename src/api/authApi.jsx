// src/api/authApi.js
import axios from "axios";

const authApi = axios.create({
  baseURL: import.meta.env.VITE_BASE_API, 
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
    return config;
  },
  (error) => Promise.reject(error)
);

export default authApi;
