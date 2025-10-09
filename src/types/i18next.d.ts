import "i18next";

// Extend Express Request to include i18next properties
declare module "express-serve-static-core" {
  interface Request {
    t: (key: string, options?: Record<string, unknown>) => string;
    language: string;
  }
}

// Type declarations for i18next-http-middleware
declare module "i18next-http-middleware" {
  import type { Handler } from "express";
  import type { i18n } from "i18next";

  export function handle(i18next: i18n): Handler;
}
