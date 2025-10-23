import type { Request, Response } from "express";
import { env } from "../config/env.js";
import {
  authService,
  type LoginCredentials,
  type SignupCredentials,
} from "../services/authService.js";

/**
 * Auth controller for handling authentication requests
 */
export class AuthController {
  /**
   * Handle login request
   * POST /auth/login
   */
  public login = async (req: Request, res: Response): Promise<void> => {
    const {
      email,
      password,
      returnTo,
    }: LoginCredentials & { returnTo?: string } = req.body;

    try {
      // Validate input
      if (!email || !password) {
        res.render("login", {
          title: "Sign In",
          error: "Email and password are required",
          formData: { email },
          returnTo: returnTo || "/",
        });
        return;
      }

      // Attempt login
      const result = await authService.login({ email, password });

      if (result.success) {
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

        // Get profile data to get complete user info including admin status
        try {
          // Create a combined cookie object including the new Better Auth cookies
          const combinedCookies = { ...req.cookies };

          // Parse and add the Better Auth cookies from the response
          if (result.cookies && result.cookies.length > 0) {
            result.cookies.forEach((cookieHeader) => {
              const cookies = cookieHeader.split(", ");
              cookies.forEach((cookie) => {
                const cookieParts = cookie.split(";");
                const firstPart = cookieParts[0];
                if (firstPart) {
                  const [name, value] = firstPart.split("=");
                  if (name && value) {
                    combinedCookies[name.trim()] = decodeURIComponent(
                      value.trim()
                    );
                  }
                }
              });
            });
          }

          const profileResult = await authService.getProfile(combinedCookies);
          if (profileResult.success && profileResult.user) {
            const profileUser = profileResult.user;
            const isAdmin = profileUser.isAdmin || profileUser.role === "admin";

            // Store real user data from profile (which should be more complete)
            res.cookie("userName", profileUser.name, {
              httpOnly: false,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              maxAge: 24 * 60 * 60 * 1000,
            });

            res.cookie("userEmail", profileUser.email, {
              httpOnly: false,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              maxAge: 24 * 60 * 60 * 1000,
            });

            // Store admin status in cookie for frontend
            res.cookie("isAdmin", isAdmin.toString(), {
              httpOnly: true, // Prevent client-side access for security
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              maxAge: 24 * 60 * 60 * 1000, // 24 hours
            });
          } else {
            console.log("Profile fetch failed");
            // Fallback to login data if profile fails
            res.cookie("userName", result.data.user.name, {
              httpOnly: false,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              maxAge: 24 * 60 * 60 * 1000,
            });

            res.cookie("userEmail", result.data.user.email, {
              httpOnly: false,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              maxAge: 24 * 60 * 60 * 1000,
            });

            // Default admin to false if profile call fails
            res.cookie("isAdmin", "false", {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              maxAge: 24 * 60 * 60 * 1000,
            });
          }
        } catch (_profileError) {
          console.log("Profile fetch error");
          // Fallback to login data
          res.cookie("userName", result.data.user.name, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
          });

          res.cookie("userEmail", result.data.user.email, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
          });

          res.cookie("isAdmin", "false", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
          });
        }

        // Send JSON response instead of redirect for AJAX requests
        // Determine where to redirect after login
        let finalRedirectUrl = "/profile"; // Default

        if (returnTo && returnTo.trim() !== "" && returnTo !== "/") {
          // If we have a valid returnTo that's not just "/" or empty, use it
          finalRedirectUrl = returnTo;
        }

        // Server-side redirect
        res.redirect(finalRedirectUrl);
      } else {
        // Re-render login form with error
        res.render("login", {
          title: "Sign In",
          error: "Invalid email or password",
          formData: { email },
          returnTo: returnTo || "/",
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
        console.log("Authentication failed");
      } else {
        // Log other errors with more detail for debugging
        console.error("Login error:", errorMessage);
      }

      // Re-render login form with error
      res.render("login", {
        title: "Sign In",
        error: errorMessage,
        formData: { email },
        returnTo: returnTo || "/",
      });
    }
  };

  /**
   * Handle signup request
   * POST /auth/signup
   */
  public signup = async (req: Request, res: Response): Promise<void> => {
    const {
      email,
      password,
      confirmPassword,
      returnTo,
    }: SignupCredentials & { confirmPassword?: string; returnTo?: string } =
      req.body;

    try {
      // Validate input
      if (!email || !password) {
        res.render("login", {
          title: "Sign In",
          signupError: "Email and password are required",
          signupFormData: { email },
          returnTo: returnTo || "/",
        });
        return;
      }

      // Check password confirmation if provided
      if (confirmPassword && password !== confirmPassword) {
        res.render("login", {
          title: "Sign In",
          signupError: "Passwords do not match",
          signupFormData: { email },
          returnTo: returnTo || "/",
        });
        return;
      }

      // Attempt signup
      const result = await authService.signup({ email, password });

      if (result.success) {
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

        // Store user data in cookies (similar to login flow)
        try {
          // Create a combined cookie object including the new Better Auth cookies
          const combinedCookies = { ...req.cookies };

          // Parse and add the Better Auth cookies from the response
          if (result.cookies && result.cookies.length > 0) {
            result.cookies.forEach((cookieHeader) => {
              const cookies = cookieHeader.split(", ");
              cookies.forEach((cookie) => {
                const cookieParts = cookie.split(";");
                const firstPart = cookieParts[0];
                if (firstPart) {
                  const [name, value] = firstPart.split("=");
                  if (name && value) {
                    combinedCookies[name.trim()] = decodeURIComponent(
                      value.trim()
                    );
                  }
                }
              });
            });
          }

          // Store user data from signup response
          res.cookie("userName", result.data.user.name, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
          });

          res.cookie("userEmail", result.data.user.email, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
          });

          // Default admin to false for new users
          res.cookie("isAdmin", "false", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
          });
        } catch (_profileError) {
          console.log("Error setting user cookies after signup");
        }

        // Determine where to redirect after signup
        let finalRedirectUrl = "/profile"; // Default

        if (returnTo && returnTo.trim() !== "" && returnTo !== "/") {
          // If we have a valid returnTo that's not just "/" or empty, use it
          finalRedirectUrl = returnTo;
        }

        // Server-side redirect
        res.redirect(finalRedirectUrl);
      } else {
        // Re-render login form with signup error
        res.render("login", {
          title: "Sign In",
          signupError: "Registration failed",
          signupFormData: { email },
          returnTo: returnTo || "/",
        });
      }
    } catch (error: unknown) {
      // Clean error logging for registration failures
      const errorMessage =
        error instanceof Error ? error.message : "Signup failed";

      if (
        errorMessage.includes("already exists") ||
        errorMessage.includes("409")
      ) {
        // Log duplicate account attempts cleanly
        console.log("Signup failed: Account already exists");
      } else {
        // Log other errors with more detail for debugging
        console.error("Signup error:", errorMessage);
      }

      // Re-render login form with signup error
      res.render("login", {
        title: "Sign In",
        signupError: errorMessage,
        signupFormData: { email },
        returnTo: returnTo || "/",
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
      res.clearCookie("isAdmin");
      res.clearCookie("userName");
      res.clearCookie("userEmail");

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
      console.error("Logout error:", error);
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
      // Validate session by checking for proper session cookies
      const hasSession = req.cookies?.session;
      const hasBetterAuthSession =
        req.cookies &&
        (req.cookies["better-auth.session_data"] ||
          req.cookies["better-auth.session_token"]);

      if (hasSession && hasBetterAuthSession) {
        // For now, we'll validate using our session cookie and return basic user info
        // In a real implementation, you'd validate the session with the external API
        // and return actual user data from the database

        try {
          // Attempt to get user data from external API using session cookies
          const sessionCookies: { [key: string]: string } = {};
          for (const [key, value] of Object.entries(req.cookies)) {
            if (
              key.toLowerCase().includes("session") ||
              key.toLowerCase().includes("auth") ||
              key.toLowerCase().includes("better-auth") ||
              key.startsWith("better-auth.")
            ) {
              sessionCookies[key] = value;
            }
          }

          const cookieString = Object.entries(sessionCookies)
            .map(([key, value]) => `${key}=${value}`)
            .join("; ");

          // Make request to external API to validate session and get user data
          const response = await fetch(`${env.backendUrl}/auth/session`, {
            method: "GET",
            headers: {
              Cookie: cookieString,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const userData = await response.json();
            res.json({
              success: true,
              user: userData.user,
            });
            return;
          }
        } catch (_error) {
          // Fall through to session invalid response
        }
      }

      // Session is invalid or missing
      res.json({ success: false });
    } catch (error: unknown) {
      console.error("Auth check failed:", error);
      res.status(500).json({ success: false, message: "Auth check failed" });
    }
  };

  /**
   * GET /profile
   */
  public getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
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

      // Get real user data from session
      const user = await authService.getUserFromSession(req.cookies);

      if (!user) {
        // Redirect to login if user data can't be retrieved
        res.redirect("/login?redirect=/profile");
        return;
      }

      // Render profile page with real user data
      res.render("profile", {
        title: "User Profile",
        currentPage: "profile",
        user: user,
        isAuthenticated: true,
        isAdmin: user.isAdmin || false,
      });
    } catch (error: unknown) {
      console.error("Profile page error:", error);
      res.status(500).render("error", {
        title: "Error",
        message: "Unable to load profile",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  /**
   * Get login page
   * GET /login
   */
  public getLogin = (req: Request, res: Response): void => {
    const returnTo = req.query.returnTo as string;

    // Decode the returnTo URL if it's encoded
    const decodedReturnTo = returnTo ? decodeURIComponent(returnTo) : undefined;

    res.render("login", {
      title: "Login & Sign Up",
      currentPage: "login",
      returnTo: decodedReturnTo,
    });
  };
}
