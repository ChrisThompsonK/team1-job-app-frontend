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
      const response = await fetch(
        "http://localhost:3001/api/auth/sign-in/email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

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
   * Check if user is authenticated by checking for session cookie
   * This avoids making unnecessary API calls
   */
  async checkAuthStatus(): Promise<{ success: boolean; user?: User }> {
    // Check if we're in browser environment
    if (typeof document === "undefined") {
      // Server-side: we can't check cookies here, return false
      return { success: false };
    }

    // Check for session cookie
    const hasSessionCookie = document.cookie
      .split(";")
      .some((cookie) => cookie.trim().startsWith("session="));

    if (hasSessionCookie) {
      // If we have a session cookie, assume user is authenticated
      // In a real app, you might decode the session or have user data in localStorage
      return {
        success: true,
        user: {
          id: "unknown",
          name: "Authenticated User",
          email: "user@example.com",
          emailVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
    }

    return {
      success: false,
    };
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
        // Filter to only include session-related cookies (not language, preferences, etc.)
        const sessionCookies: { [key: string]: string } = {};
        for (const [key, value] of Object.entries(cookies)) {
          // Include Better Auth cookies and other session-related cookies
          if (
            key.toLowerCase().includes("session") ||
            key.toLowerCase().includes("auth") ||
            key.toLowerCase().includes("token") ||
            key.toLowerCase().includes("better-auth") ||
            key.startsWith("better-auth.") ||
            key.toLowerCase().includes("continue") ||
            key.toLowerCase().includes("code")
          ) {
            sessionCookies[key] = value;
          }
        }

        // Only proceed if we have session cookies
        if (Object.keys(sessionCookies).length > 0) {
          // Create a cookie string from the session cookies only
          const cookieString = Object.entries(sessionCookies)
            .map(([key, value]) => `${key}=${value}`)
            .join("; ");

          // Call external API with forwarded session cookies
          const response = await fetch(
            "http://localhost:3001/api/auth/sign-out",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Cookie: cookieString,
              },
            }
          );

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
}

export const authService = new AuthService();
