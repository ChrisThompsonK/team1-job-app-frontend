import type { Request, Response } from "express";
import { analyticsService } from "../services/analyticsService.js";

/**
 * Analytics Controller
 * Handles requests for Google Analytics data
 */
export class AnalyticsController {
  /**
   * Get analytics dashboard data
   */
  async getDashboard(_req: Request, res: Response): Promise<void> {
    try {
      if (!analyticsService.isConfigured()) {
        res.status(503).json({
          error: "Analytics service not configured",
          message:
            "Please set GA4_PROPERTY_ID and GOOGLE_APPLICATION_CREDENTIALS",
        });
        return;
      }

      const [pageViews, activeUsers, jobRoleAnalytics] = await Promise.all([
        analyticsService.getPageViews(),
        analyticsService.getActiveUsers(),
        analyticsService.getJobRoleAnalytics(),
      ]);

      res.json({
        pageViews: pageViews.rows || [],
        activeUsers:
          activeUsers.rows?.[0]?.metricValues?.[0]?.value || "0",
        topJobRoles: jobRoleAnalytics.rows || [],
      });
    } catch (error) {
      console.error("Error fetching analytics dashboard:", error);
      res.status(500).json({
        error: "Failed to fetch analytics data",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Get page views for specific date range
   */
  async getPageViews(req: Request, res: Response): Promise<void> {
    try {
      if (!analyticsService.isConfigured()) {
        res.status(503).json({
          error: "Analytics service not configured",
        });
        return;
      }

      const { startDate = "7daysAgo", endDate = "today" } = req.query;

      const report = await analyticsService.getPageViews(
        startDate as string,
        endDate as string
      );

      res.json({
        data: report.rows || [],
        rowCount: report.rowCount,
      });
    } catch (error) {
      console.error("Error fetching page views:", error);
      res.status(500).json({
        error: "Failed to fetch page views",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Get job role analytics
   */
  async getJobRoleAnalytics(req: Request, res: Response): Promise<void> {
    try {
      if (!analyticsService.isConfigured()) {
        res.status(503).json({
          error: "Analytics service not configured",
        });
        return;
      }

      const { startDate = "30daysAgo", endDate = "today" } = req.query;

      const report = await analyticsService.getJobRoleAnalytics(
        startDate as string,
        endDate as string
      );

      res.json({
        data: report.rows || [],
        rowCount: report.rowCount,
      });
    } catch (error) {
      console.error("Error fetching job role analytics:", error);
      res.status(500).json({
        error: "Failed to fetch job role analytics",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Get custom event analytics
   */
  async getEventAnalytics(req: Request, res: Response): Promise<void> {
    try {
      if (!analyticsService.isConfigured()) {
        res.status(503).json({
          error: "Analytics service not configured",
        });
        return;
      }

      const { eventName, startDate = "7daysAgo", endDate = "today" } =
        req.query;

      if (!eventName || typeof eventName !== "string") {
        res.status(400).json({
          error: "Event name is required",
        });
        return;
      }

      const report = await analyticsService.getEventData(
        eventName,
        startDate as string,
        endDate as string
      );

      res.json({
        data: report.rows || [],
        rowCount: report.rowCount,
      });
    } catch (error) {
      console.error("Error fetching event analytics:", error);
      res.status(500).json({
        error: "Failed to fetch event analytics",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

export const analyticsController = new AnalyticsController();
