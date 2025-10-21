import type { Request, Response } from "express";

/**
 * Home controller for handling basic page requests
 */
export class HomeController {
  /**
   * Render the home page
   * GET /
   */
  public getHome = (_req: Request, res: Response): void => {
    res.render("index", {
      title: "Job Application Frontend",
      message: "Welcome to the Job Application System",
      timestamp: new Date().toISOString(),
    });
  };

  /**
   * API Hello World endpoint
   * GET /api
   */
  public getApi = (_req: Request, res: Response): void => {
    res.json({ message: "Hello World! 🌍" });
  };

  /**
   * Health check endpoint
   * GET /health
   */
  public getHealth = (_req: Request, res: Response): void => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
  };

  /**
   * Handle language change
   * POST /change-language
   */
  public changeLanguage = (req: Request, res: Response): void => {
    const { language } = req.body;
    if (["en", "es", "fr", "pl"].includes(language)) {
      res.cookie("i18next", language, { maxAge: 365 * 24 * 60 * 60 * 1000 });
      res.json({ success: true, language });
    } else {
      res.status(400).json({ success: false, error: "Invalid language" });
    }
  };
}
