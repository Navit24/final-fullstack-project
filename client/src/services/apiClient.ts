import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "../config/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        if (
          !window.location.pathname.includes("/login") &&
          !window.location.pathname.includes("/register")
        ) {
          window.location.href = "/login";
        }
      }

      const data = error.response.data;
      const message =
        typeof data === "object" &&
        data !== null &&
        "message" in data &&
        typeof (data as { message: unknown }).message === "string"
          ? (data as { message: string }).message
          : error.message;
      return Promise.reject(new Error(message));
    }

    if (error.request) {
      return Promise.reject(
        new Error("Network error. Please check your connection.")
      );
    }

    return Promise.reject(error);
  }
);

export default apiClient;
