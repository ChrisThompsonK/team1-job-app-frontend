import { apiService } from "./apiService.js";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
  };
}

export interface BackendAuthResponse {
  redirect: boolean;
  token: string;
  user: User;
}

/**
 * Authentication service for handling login, logout, and auth status
 */
class AuthService {
  /**
   * Authenticate user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiService.post<BackendAuthResponse>(
        "/auth/sign-in/email",
        credentials
      );

      // Transform backend response to our frontend format
      const backendData = response.data;

      return {
        success: true,
        data: {
          user: backendData.user,
        },
      };
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        throw new Error(axiosError.response?.data?.message || "Login failed");
      }
      throw new Error("Login failed");
    }
  }
}

export const authService = new AuthService();
