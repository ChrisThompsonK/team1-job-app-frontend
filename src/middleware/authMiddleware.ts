import type { Request, Response, NextFunction } from "express";

/**
 * Interface for authenticated user data stored in session/cookies
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
}

/**
 * Extend Express Request interface to include user property
 */
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * Middleware to check if user is authenticated
 * If not authenticated, redirects to login page with a return URL
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  // Check if user is authenticated (you can modify this based on your auth mechanism)
  // For now, checking for authentication token in cookies
  const isAuthenticated = req.cookies?.auth_token || req.cookies?.user_session;
  
  if (!isAuthenticated) {
    // Store the current URL to redirect back after login
    const returnTo = req.originalUrl;
    
    // Redirect to login page with return URL as query parameter
    res.redirect(`/login?returnTo=${encodeURIComponent(returnTo)}`);
    return;
  }
  
  // If authenticated, proceed to the next middleware/route handler
  next();
};

/**
 * Middleware to check authentication status and set user in request
 * This doesn't redirect but sets req.user if authenticated
 */
export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
  // Check for authentication token in cookies
  const authToken = req.cookies?.auth_token;
  const userSession = req.cookies?.user_session;
  
  if (authToken || userSession) {
    // You would typically decode the token or get user data here
    // For now, setting a mock user - in a real app you'd decode the token
    req.user = {
      id: "1",
      email: "user@example.com", 
      name: "User"
    };
  }
  
  next();
};