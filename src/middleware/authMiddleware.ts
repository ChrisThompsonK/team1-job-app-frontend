import type { NextFunction, Request, Response } from "express";

/**
 * Authentication middleware to protect routes
 * Redirects unauthenticated users to login page with returnTo parameter
 */
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Check for session cookie on server-side
  const hasSession = req.cookies?.session;
  const hasBetterAuthSession =
    req.cookies &&
    (req.cookies["better-auth.session_data"] ||
      req.cookies["better-auth.session_token"]);

  if (!hasSession && !hasBetterAuthSession) {
    // Construct the return URL for after login
    const returnTo = encodeURIComponent(req.originalUrl);

    // Redirect to login with returnTo parameter
    res.redirect(`/login?returnTo=${returnTo}`);
    return;
  }

  // User is authenticated, proceed to next middleware/route handler
  next();
};

/**
 * Optional authentication middleware that sets user data if authenticated
 * Does not redirect if unauthenticated, just continues
 */
export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Check for session cookie on server-side
  const hasSession = req.cookies?.session;
  const hasBetterAuthSession =
    req.cookies &&
    (req.cookies["better-auth.session_data"] ||
      req.cookies["better-auth.session_token"]);

  // Set authentication status for use in templates
  res.locals.isAuthenticated = hasSession || hasBetterAuthSession;

  // Continue regardless of authentication status
  next();
};
