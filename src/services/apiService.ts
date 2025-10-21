import axios from "axios";
import { env } from "../config/env.js";

/**
 * Centralized API service for making HTTP requests
 * Configured with proper base URL and session management
 */
class ApiService {
  private api = axios.create({
    baseURL: env.backendUrl, // External auth API
    withCredentials: true, // Essential for session cookies
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 10_000, // 10 second timeout
  });

  constructor() {
    // Add request interceptor for debugging
    this.api.interceptors.request.use(
      (config) => {
        console.log(
          `[API] Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`
        );
        return config;
      },
      (error) => {
        console.error("[API] Request error:", error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for debugging
    this.api.interceptors.response.use(
      (response) => {
        console.log(
          `[API] Response from ${response.config.url}:`,
          response.status
        );
        return response;
      },
      (error) => {
        console.error("[API] Response error:", error.message);
        if (error.code === "ECONNREFUSED") {
          console.error(
            "[API] Connection refused - is the auth server running on http://localhost:3000?"
          );
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Make a POST request
   */
  public post<T>(url: string, data?: unknown) {
    return this.api.post<T>(url, data);
  }

  /**
   * Make a GET request
   */
  public get<T>(url: string) {
    return this.api.get<T>(url);
  }

  /**
   * Make a PUT request
   */
  public put<T>(url: string, data?: unknown) {
    return this.api.put<T>(url, data);
  }

  /**
   * Make a DELETE request
   */
  public delete<T>(url: string) {
    return this.api.delete<T>(url);
  }
}

export const apiService = new ApiService();
