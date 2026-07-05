import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { getToken, clearToken } from "./auth";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const instance = axios.create({
  baseURL: baseURL,
  timeout: 30000, // Fixed to 30s
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor 
instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // If the server returns 401, the token is likely invalid/expired
    if (error.response?.status === 401) {
      clearToken();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default instance;