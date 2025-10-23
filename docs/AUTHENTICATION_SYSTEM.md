# Authentication System Documentation

## Overview

The job application frontend uses a dual authentication system that proxies requests to an external Better Auth backend while maintaining its own session management. This document provides a comprehensive reference for developers working with the authentication system.

## Architecture

### Authentication Flow
```
Client (Browser) → Frontend Server → External Better Auth API
                ↓
            Session Cookies
```

### Key Features
- **Proxy Authentication**: Frontend server acts as a proxy to Better Auth API
- **Dual Session Management**: Both frontend and Better Auth sessions are maintained
- **Cookie Forwarding**: Authentication cookies are properly forwarded between systems
- **Secure Logout**: Multi-layer logout clearing all session data

## Components

#### 1. AuthController (`src/controllers/authController.ts`)
Handles authentication endpoints and proxies requests to the external API.

**Key Methods:**
- `login()` - POST /auth/login
- `logout()` - POST /auth/logout  
- `checkAuthStatus()` - GET /auth/session
- `getProfile()` - GET /profile
- `getLogin()` - GET /login

#### 2. AuthService (`src/services/authService.ts`)
Manages communication with the external Better Auth API.

**Key Methods:**
- `login(credentials)` - Authenticates with external API
- `logout(cookies)` - Logs out from external API
- `checkAuthStatus()` - Validates session

#### 3. Client-Side Auth (`public/js/auth.js`)
Handles frontend authentication UI and API calls.

**Key Features:**
- Form submission handling
- Loading states and error display
- Session status checking
- Credential validation

**Key Methods:**
- `login(credentials)` - Calls /auth/login endpoint
- `logout()` - Calls /auth/logout endpoint
- `checkAuthStatus()` - Calls /auth/session endpoint

## Session Management

### Cookie Types
The system uses multiple cookies for comprehensive session management:

#### Session Cookies:
1. **`session`** - Frontend session cookie (user ID)
2. **`better-auth.session_data`** - Better Auth session data
3. **`better-auth.session_token`** - Better Auth session token
4. **`continueCode`** - Temporary authentication code

#### Cookie Handling Pattern:
When making authenticated requests to the external API, use this pattern to forward session cookies:

```typescript
// Extract session-related cookies
const sessionCookies: { [key: string]: string } = {};
for (const [key, value] of Object.entries(cookies)) {
  if (
    key.toLowerCase().includes("session") ||
    key.toLowerCase().includes("auth") ||
    key.toLowerCase().includes("better-auth") ||
    key.startsWith("better-auth.")
  ) {
    sessionCookies[key] = value;
  }
}

// Create cookie string for API requests
const cookieString = Object.entries(sessionCookies)
  .map(([key, value]) => `${key}=${value}`)
  .join("; ");

// Use in fetch requests
const response = await fetch(`${env.backendUrl}/api/endpoint`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Cookie: cookieString,
  },
  body: JSON.stringify(data),
});
```

## API Integration

### External Better Auth API
The system integrates with an external Better Auth API for user management.

**Base URL**: Configured via `BACKEND_URL` environment variable  
**Default**: `http://localhost:3001/api`

### Key Endpoints
- **POST /auth/sign-in/email** - User login
- **POST /auth/sign-out** - User logout  
- **GET /auth/session** - Session validation

### User Data Structure

Current `User` interface (from `authService.ts`):
```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## Usage Examples

### Making Authenticated Requests
When calling protected endpoints, always include session cookies:

```typescript
// In a controller
const sessionCookies = extractSessionCookies(req.cookies);
const response = await fetch(`${env.backendUrl}/protected-endpoint`, {
  method: "GET",
  headers: {
    Cookie: sessionCookies,
    "Content-Type": "application/json",
  },
  credentials: "include",
});
```

### Client-Side Authentication Check
```javascript
// Check if user is authenticated
const authStatus = await authService.checkAuthStatus();
if (authStatus.success) {
  console.log("User is authenticated:", authStatus.data.user);
} else {
  console.log("User is not authenticated");
}
```

### Template Authentication Context
To pass authentication context to templates:

```typescript
// In a controller
const user = await getUserFromSession(req.cookies);
res.render("template-name", {
  title: "Page Title",
  user: user,
  isAuthenticated: !!user,
  // other template data...
});
```

## Environment Configuration

### Required Environment Variables
```bash
# Backend API URL
BACKEND_URL=http://localhost:3001/api

# Node environment
NODE_ENV=development

# Server port
PORT=3000
```

## Security Considerations

### Cookie Security
- **HttpOnly**: Session cookies are httpOnly to prevent XSS
- **Secure**: Set to true in production for HTTPS
- **SameSite**: Set to 'lax' for CSRF protection

### Session Validation
- Always validate sessions server-side
- Never trust client-side authentication state
- Forward cookies properly to external API for validation

### Error Handling
- Clean error logging for authentication failures
- No sensitive information in error messages
- Graceful fallback for authentication failures

## Development Guidelines

### Adding New Protected Routes
1. Extract user session from cookies
2. Validate session with external API
3. Handle authentication failures gracefully
4. Forward cookies for API calls

### Testing Authentication
1. Test with valid sessions
2. Test with expired sessions  
3. Test with missing cookies
4. Test cookie forwarding to external API

## Common Patterns

### Session Cookie Extraction
```typescript
function extractSessionCookies(cookies: { [key: string]: string }): string {
  const sessionCookies: { [key: string]: string } = {};
  
  for (const [key, value] of Object.entries(cookies)) {
    if (
      key.toLowerCase().includes("session") ||
      key.toLowerCase().includes("auth") ||
      key.toLowerCase().includes("better-auth") ||
      key.startsWith("better-auth.")
    ) {
      sessionCookies[key] = value;
    }
  }
  
  return Object.entries(sessionCookies)
    .map(([key, value]) => `${key}=${value}`)
    .join("; ");
}
```

### Error Response Handling
```typescript
try {
  const response = await fetch(apiEndpoint, options);
  
  if (!response.ok) {
    if (response.status === 401) {
      // Handle authentication failure
      return res.redirect("/login");
    }
    throw new Error(`API error: ${response.status}`);
  }
  
  const data = await response.json();
  // Handle success
} catch (error) {
  // Handle network/other errors
  console.error("API call failed:", error);
}
```

## Troubleshooting

### Common Issues
1. **Cookies not forwarded**: Ensure proper cookie extraction and forwarding
2. **Session expires**: Implement proper session refresh logic
3. **CORS issues**: Configure proper CORS headers in backend
4. **Environment variables**: Verify BACKEND_URL is correctly set

### Debugging Tips
1. Check browser Network tab for cookie headers
2. Verify session cookies are present in requests
3. Test API endpoints directly with proper cookies
4. Check server logs for authentication errors