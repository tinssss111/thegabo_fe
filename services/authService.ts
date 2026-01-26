/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/lib/api/client";
import { AuthResponse, LoginRequest, RegisterRequest } from "@/types/user";

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/login", data);

    if (response.data.success && response.data.data) {
      // Backend returns "accessToken" not "token"
      const token =
        (response.data.data as any).accessToken || response.data.data.token;
      const user = response.data.data.user;

      if (token) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));
      }
    }

    return response.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/register", data);

    if (response.data.success && response.data.data) {
      const token =
        (response.data.data as any).accessToken || response.data.data.token;
      const user = response.data.data.user;

      if (token) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));
      }
    }

    return response.data;
  },

  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
    }
  },

  getCurrentUser() {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("authToken");
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};
