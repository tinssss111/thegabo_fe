import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // Log request for debugging
    console.log(
      `[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
    );

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
  (response) => {
    console.log(
      `[API Response] ${response.status} ${response.config.url}`,
      response.data,
    );
    return response;
  },
  (error) => {
    const errorInfo = {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
    };
    console.error(`[API Error]`, errorInfo);

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
