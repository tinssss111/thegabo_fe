import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://thegabo.onrender.com/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        const isCartRequest = error.config?.url?.includes("/cart");

        if (isCartRequest) {
          return Promise.reject(error);
        }

        if (currentPath !== "/login" && currentPath !== "/register") {
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  },
);
