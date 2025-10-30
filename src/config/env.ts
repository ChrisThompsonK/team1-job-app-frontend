/**
 * Environment configuration with validation and sensible defaults
 */

interface EnvConfig {
  port: number;
  backendUrl: string;
  nodeEnv: string;
}

/**
 * Validates and parses the PORT environment variable
 */
function parsePort(portStr: string | undefined): number {
  const defaultPort = 3000;

  if (!portStr) {
    return defaultPort;
  }

  const port = Number.parseInt(portStr, 10);

  if (Number.isNaN(port)) {
    console.warn(
      `Invalid PORT value "${portStr}". Using default port ${defaultPort}.`
    );
    return defaultPort;
  }

  if (port < 1 || port > 65535) {
    console.warn(
      `PORT ${port} is out of valid range (1-65535). Using default port ${defaultPort}.`
    );
    return defaultPort;
  }

  return port;
}

/**
 * Validates and parses the BACKEND_URL environment variable
 */
function parseBackendUrl(urlStr: string | undefined): string {
  const defaultUrl = "http://localhost:3001";

  if (!urlStr) {
    return defaultUrl;
  }

  try {
    const url = new URL(urlStr);
    if (!url.protocol.startsWith("http")) {
      console.warn(
        `BACKEND_URL must use http or https protocol. Using default: ${defaultUrl}`
      );
      return defaultUrl;
    }
    return urlStr;
  } catch (_error) {
    console.warn(
      `Invalid BACKEND_URL "${urlStr}". Using default: ${defaultUrl}`
    );
    return defaultUrl;
  }
}

/**
 * Loads and validates environment configuration
 */
function loadEnvConfig(): EnvConfig {
  const config: EnvConfig = {
    port: parsePort(process.env.PORT),
    backendUrl: parseBackendUrl(process.env.BACKEND_URL),
    nodeEnv: process.env.NODE_ENV || "development",
  };

  // Log configuration in development mode
  if (config.nodeEnv === "development") {
    console.log("Environment Configuration:");
    console.log(`  PORT: ${config.port}`);
    console.log(`  BACKEND_URL: ${config.backendUrl}`);
    console.log(`  NODE_ENV: ${config.nodeEnv}`);
  }

  return config;
}

// Export singleton instance
export const env = loadEnvConfig();
