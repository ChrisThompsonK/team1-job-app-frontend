import type { Request, Response } from "express";
import { authService, type LoginCredentials } from "../services/authService.js";

/**
 * Auth controller for handling authentication requests
 */
export class AuthController {
  /**
   * Handle login request
   * POST /auth/login
   */
  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password }: LoginCredentials = req.body;

      // Validate input
      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
        return;
      }

      // Attempt login
      const result = await authService.login({ email, password });

      if (result.success) {
        console.log("✅ Login successful for user:", result.data.user.email);

        // Set our own session cookie for authentication
        res.cookie("session", result.data.user.id, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
        });

        // Forward Better Auth cookies if they exist
        if (result.cookies && result.cookies.length > 0) {
          result.cookies.forEach((cookieString) => {
            res.setHeader("Set-Cookie", cookieString);
          });
        }

        res.status(200).json(result);
      } else {
        res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }
    } catch (error: unknown) {
      // Clean error logging for authentication failures
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";

      if (
        errorMessage.includes("credentials") ||
        errorMessage.includes("unauthorized") ||
        errorMessage.includes("401")
      ) {
        // Log authentication failures cleanly without stack trace
        console.log(
          `❌ Authentication failed for email: ${req.body.email || "unknown"} - Invalid credentials`
        );
      } else {
        // Log other errors with more detail for debugging
        console.error("❌ Login system error:", errorMessage);
      }

      res.status(401).json({
        success: false,
        message: errorMessage,
      });
    }
  };

  /**
   * Handle logout request
   * POST /auth/logout
   */
  public logout = async (req: Request, res: Response): Promise<void> => {
    try {
      // Try to call external logout API with session forwarding
      let externalLogoutSuccess = false;
      try {
        const result = await authService.logout(req.cookies);
        externalLogoutSuccess = result.success;
      } catch (_error) {
        // Silent fail for external logout
      }

      // Clear all authentication-related cookies
      res.clearCookie("session");

      // Clear Better Auth cookies if they exist
      if (req.cookies["better-auth.session_data"]) {
        res.clearCookie("better-auth.session_data");
      }
      if (req.cookies["better-auth.session_token"]) {
        res.clearCookie("better-auth.session_token");
      }

      // Clear any other session-related cookies
      if (req.cookies.continueCode) {
        res.clearCookie("continueCode");
      }

      res.json({
        success: true,
        externalLogout: externalLogoutSuccess,
        message: externalLogoutSuccess
          ? "Fully logged out"
          : "Logged out locally (external logout failed)",
      });
    } catch (error: unknown) {
      console.error("❌ Logout failed:", error);
      res.status(500).json({ success: false, message: "Logout failed" });
    }
  }; /**
   * Check authentication status
   * GET /auth/session
   */
  public checkAuthStatus = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      // Check for session cookie on server-side
      const hasSession = req.cookies?.session;

      if (hasSession) {
        res.json({
          success: true,
          user: {
            id: "unknown",
            name: "Authenticated User",
            email: "user@example.com",
            emailVerified: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        });
      } else {
        res.json({ success: false });
      }
    } catch (error: unknown) {
      console.error("❌ Auth status check failed:", error);
      res.status(500).json({ success: false, message: "Auth check failed" });
    }
  };

  /**
   * GET /profile
   */
  public getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("🔍 Profile route - checking authentication");
      console.log("🍪 All cookies:", req.cookies);

      // Check for session cookie on server-side
      const hasSession = req.cookies?.session;
      const hasBetterAuthSession =
        req.cookies &&
        (req.cookies["better-auth.session_data"] ||
          req.cookies["better-auth.session_token"]);

      if (!hasSession && !hasBetterAuthSession) {
        // Redirect to login if not authenticated
        res.redirect("/login?redirect=/profile");
        return;
      }

      // Render profile page with mock user data
      res.render("profile", {
        title: "User Profile",
        currentPage: "profile",
        user: {
          id: "unknown",
          name: "Authenticated User",
          email: "user@example.com",
          emailVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
    } catch (error: unknown) {
      console.error("Profile page error:", error);
      res.status(500).render("error", {
        title: "Error",
        message: "Unable to load profile",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }; /**
   * Get login page
   * GET /login
   */
  public getLogin = (_req: Request, res: Response): void => {
    res.render("login", {
      title: "Login & Sign Up",
      currentPage: "login",
    });
  };
}
