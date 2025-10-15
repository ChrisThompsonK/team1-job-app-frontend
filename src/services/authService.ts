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

export interface AuthStatusResponse {
  success: boolean;
  data?: {
    user: User;
    authenticated: boolean;
  };
  message?: string;
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

  /**
   * Logout the current user
   */
  async logout(): Promise<{ success: boolean; message?: string }> {
    try {
      await apiService.post("/auth/logout");
      return { success: true };
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        return {
          success: false,
          message: axiosError.response?.data?.message || "Logout failed",
        };
      }
      return { success: false, message: "Logout failed" };
    }
  }

  /**
   * Check the current authentication status
   */
  async checkAuthStatus(): Promise<AuthStatusResponse> {
    try {
      const response = await apiService.get<AuthStatusResponse>("/auth/status");
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        return {
          success: false,
          message:
            axiosError.response?.data?.message ||
            "Unable to check authentication status",
        };
      }
      return {
        success: false,
        message: "Unable to check authentication status",
      };
    }
  }
}

export const authService = new AuthService();
