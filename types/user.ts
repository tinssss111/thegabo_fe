export interface User {
  _id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  addresses: string;
  avatar?: string;
  role?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  addresses: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: User;
    token?: string;
    accessToken?: string;
  };
}
