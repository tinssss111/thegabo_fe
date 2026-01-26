/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types/user";
import { authService } from "@/services/authService";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    fullName: string;
    phoneNumber: string;
    addresses: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      if (response.success && response.data) {
        // Wait a tick to ensure localStorage is updated
        await new Promise((resolve) => setTimeout(resolve, 50));
        setUser(response.data.user);
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || error.message || "Login failed",
      );
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    fullName: string;
    phoneNumber: string;
    addresses: string;
  }) => {
    try {
      const response = await authService.register(data);
      if (response.success && response.data) {
        // Wait a tick to ensure localStorage is updated
        await new Promise((resolve) => setTimeout(resolve, 50));
        setUser(response.data.user);
      } else {
        throw new Error(response.message || "Registration failed");
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || error.message || "Registration failed",
      );
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
