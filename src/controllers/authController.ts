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
      const { email, password, returnTo }: LoginCredentials & { returnTo?: string } = req.body;

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
        
        // Set authentication cookie
        res.cookie('auth_token', 'authenticated', { 
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production'
        });
        
        res.status(200).json({
          ...result,
          returnTo: returnTo || '/',
          token: 'authenticated' // Simple token for demo
        });
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
}
