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
        res.status(200).json(result);
      } else {
        res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }
    } catch (error: unknown) {
      console.error("❌ Login failed:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Login failed";

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
  public logout = async (_req: Request, res: Response): Promise<void> => {
    try {
      const result = await authService.logout();

      if (result.success) {
        console.log("✅ User logged out successfully");
        res.status(200).json({
          success: true,
          message: "Logged out successfully",
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || "Logout failed",
        });
      }
    } catch (error: unknown) {
      console.error("❌ Logout failed:", error);

      res.status(500).json({
        success: false,
        message: "An error occurred during logout",
      });
    }
  };

  /**
   * Check authentication status
   * GET /auth/status
   */
  public status = async (_req: Request, res: Response): Promise<void> => {
    try {
      const result = await authService.checkAuthStatus();

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(401).json({
          success: false,
          authenticated: false,
          message: result.message || "Not authenticated",
        });
      }
    } catch (error: unknown) {
      console.error("❌ Auth status check failed:", error);

      res.status(500).json({
        success: false,
        authenticated: false,
        message: "Unable to check authentication status",
      });
    }
  };
}
