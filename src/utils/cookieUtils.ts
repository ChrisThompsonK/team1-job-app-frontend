/**
 * Utility functions for handling authentication cookies
 */

/**
 * Extracts session-related cookies from request cookies and formats them
 * for forwarding to external APIs
 *
 * @param cookies - Request cookies object
 * @returns Cookie string formatted for HTTP headers, or empty string if no session cookies found
 */
export function extractSessionCookies(cookies?: {
  [key: string]: string;
}): string {
  if (!cookies) {
    return "";
  }

  // Filter to only include session-related cookies
  const sessionCookies: { [key: string]: string } = {};

  for (const [key, value] of Object.entries(cookies)) {
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

  // Return cookie string for HTTP headers
  return Object.entries(sessionCookies)
    .map(([key, value]) => `${key}=${value}`)
    .join("; ");
}

/**
 * Creates HTTP headers object with authentication cookies if available
 *
 * @param cookies - Request cookies object
 * @param additionalHeaders - Any additional headers to include
 * @returns Headers object with Cookie header set if session cookies exist
 */
export function createHeadersWithAuth(
  cookies?: { [key: string]: string },
  additionalHeaders: Record<string, string> = {}
): Record<string, string> {
  const headers = { ...additionalHeaders };

  const cookieString = extractSessionCookies(cookies);
  if (cookieString) {
    headers.Cookie = cookieString;
  }

  return headers;
}
