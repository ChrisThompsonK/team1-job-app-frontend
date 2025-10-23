import { env } from "../config/env.js";
import { extractSessionCookies } from "../utils/cookieUtils.js";
import { apiService } from "./apiService.js";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  name?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  role?: string;
  isAdmin?: boolean;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
  };
  cookies?: string[];
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
      // Use fetch directly to capture cookies from response headers
      const response = await fetch(`${env.backendUrl}/auth/sign-in/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Request failed with status ${response.status}`
        );
      }

      const backendData = await response.json();

      // Capture Set-Cookie headers from Better Auth
      const setCookieHeaders = response.headers.get("set-cookie");

      return {
        success: true,
        data: {
          user: backendData.user,
        },
        cookies: setCookieHeaders ? [setCookieHeaders] : [],
      };
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: {
            status?: number;
            data?: { message?: string };
          };
        };

        // Handle different HTTP status codes appropriately
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message;

        if (status === 401) {
          throw new Error("Invalid email or password");
        } else if (status === 429) {
          throw new Error("Too many login attempts. Please try again later.");
        } else if (status && status >= 500) {
          throw new Error("Server error. Please try again later.");
        } else {
          throw new Error(message || "Login failed");
        }
      }
      throw new Error("Unable to connect to authentication server");
    }
  }

  /**
   * Register new user with email and password
   */
  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    try {
      // Use fetch directly to capture cookies from response headers
      const response = await fetch(`${env.backendUrl}/auth/sign-up/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          name: credentials.name || credentials.email.split("@")[0], // Use email prefix as default name
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Request failed with status ${response.status}`
        );
      }

      const backendData = await response.json();

      // Capture Set-Cookie headers from Better Auth
      const setCookieHeaders = response.headers.get("set-cookie");

      return {
        success: true,
        data: {
          user: backendData.user,
        },
        cookies: setCookieHeaders ? [setCookieHeaders] : [],
      };
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: {
            status?: number;
            data?: { message?: string };
          };
        };

        // Handle different HTTP status codes appropriately
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message;

        if (status === 409) {
          throw new Error("An account with this email already exists");
        } else if (status === 400) {
          throw new Error("Invalid email or password format");
        } else if (status === 429) {
          throw new Error(
            "Too many registration attempts. Please try again later."
          );
        } else if (status && status >= 500) {
          throw new Error("Server error. Please try again later.");
        } else {
          throw new Error(message || "Registration failed");
        }
      }
      throw new Error("Unable to connect to authentication server");
    }
  }

  /**
   * Check if user is authenticated by validating session server-side
   * This makes a secure server-side validation instead of trusting client cookies
   */
  async checkAuthStatus(): Promise<{ success: boolean; user?: User }> {
    try {
      // Make a server-side request to validate the session
      const response = await fetch("/auth/session", {
        method: "GET",
        credentials: "include", // Include cookies for validation
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        return { success: false };
      }
    } catch (_error) {
      // If request fails, user is not authenticated
      return { success: false };
    }
  }

  /**
   * Logout user via our server proxy (which forwards session cookies)
   */
  async logout(cookies?: {
    [key: string]: string;
  }): Promise<{ success: boolean }> {
    try {
      // If we have cookies from the request, try to forward them to external API
      if (cookies) {
        const cookieString = extractSessionCookies(cookies);

        // Only proceed if we have session cookies
        if (cookieString) {
          // Call external API with forwarded session cookies
          const response = await fetch(`${env.backendUrl}/auth/sign-out`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Cookie: cookieString,
            },
          });

          if (response.ok) {
            return { success: true };
          } else {
            return { success: false };
          }
        } else {
          return { success: false };
        }
      } else {
        // Fallback to original method if no cookies
        await apiService.post("/auth/sign-out");
        return { success: true };
      }
    } catch (_error: unknown) {
      // Log logout failures but don't expose detailed errors
      return { success: false };
    }
  }

  /**
   * Get user profile from backend API
   */
  async getProfile(cookies: {
    [key: string]: string;
  }): Promise<{ success: boolean; user?: User }> {
    try {
      const cookieString = extractSessionCookies(cookies);

      const response = await fetch(`${env.backendUrl}/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieString,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        return {
          success: true,
          user: userData.data?.user || userData.user || userData,
        };
      } else {
        console.log("Profile fetch failed");
        return { success: false };
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
      return { success: false };
    }
  }

  /**
   * Get user session data from cookies without external API calls
   */
  async getUserFromSession(cookies: {
    [key: string]: string;
  }): Promise<User | null> {
    try {
      const cookieString = extractSessionCookies(cookies);

      // Only proceed if we have session cookies
      if (!cookieString) {
        return null;
      }

      // Check if we have a session token - if so, user is authenticated
      if (cookies["better-auth.session_token"]) {
        // Get real user data from cookies
        const isAdminFromCookie = cookies.isAdmin === "true";
        const userName = cookies.userName || "Unknown User";
        const userEmail = cookies.userEmail || "unknown@example.com";
        const userId = cookies.session || "unknown-id";

        // Create user object with real data from cookies
        const user: User = {
          id: userId,
          name: userName,
          email: userEmail,
          emailVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          role: isAdminFromCookie ? "admin" : "user",
          isAdmin: isAdminFromCookie,
        };

        return user;
      }

      return null;
    } catch (_error) {
      return null;
    }
  }
}

export const authService = new AuthService();
