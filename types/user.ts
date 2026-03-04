export interface User {
  _id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  addresses: any;
  latitude?: number;
  longitude?: number;
  avatar?: string;
  role?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
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
  addresses?: {
    latitude: number;
    longitude: number;
  };
  latitude?: number;
  longitude?: number;
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
