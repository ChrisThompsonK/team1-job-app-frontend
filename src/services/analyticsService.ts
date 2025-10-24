import path from "node:path";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

/**
 * Analytics Service for Google Analytics 4 Data API
 * Provides methods to fetch and analyze GA4 data
 */
class AnalyticsService {
  private client: BetaAnalyticsDataClient | null = null;
  private propertyId: string;

  constructor() {
    this.propertyId = process.env.GA4_PROPERTY_ID || "";

    // Initialize client only if credentials are configured
    const credentialsPath =
      process.env.GOOGLE_APPLICATION_CREDENTIALS ||
      "./credentials/service-account-key.json";
    const resolvedPath = path.resolve(credentialsPath);

    if (this.propertyId) {
      try {
        // Set the credentials path as an environment variable for the client
        process.env.GOOGLE_APPLICATION_CREDENTIALS = resolvedPath;
        this.client = new BetaAnalyticsDataClient();
        console.log("✅ Google Analytics client initialized successfully");
      } catch (error) {
        console.error("❌ Failed to initialize Google Analytics:", error);
        this.client = null;
      }
    } else {
      console.warn(
        "⚠️ Google Analytics not configured. Set GA4_PROPERTY_ID in .env"
      );
    }
  }

  /**
   * Check if analytics is properly configured
   */
  isConfigured(): boolean {
    return this.client !== null && this.propertyId !== "";
  }

  /**
   * Get basic analytics report
   * Example: Get page views for the last 7 days
   */
  async getPageViews(startDate = "7daysAgo", endDate = "today") {
    if (!this.client) {
      throw new Error("Analytics client not initialized");
    }

    try {
      const [response] = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [
          {
            startDate,
            endDate,
          },
        ],
        dimensions: [
          {
            name: "pagePath",
          },
        ],
        metrics: [
          {
            name: "screenPageViews",
          },
        ],
      });

      return response;
    } catch (error) {
      console.error("Error fetching page views:", error);
      throw error;
    }
  }

  /**
   * Get active users in real-time
   */
  async getActiveUsers() {
    if (!this.client) {
      throw new Error("Analytics client not initialized");
    }

    try {
      const [response] = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [
          {
            startDate: "today",
            endDate: "today",
          },
        ],
        metrics: [
          {
            name: "activeUsers",
          },
        ],
      });

      return response;
    } catch (error) {
      console.error("Error fetching active users:", error);
      throw error;
    }
  }

  /**
   * Get job role views analytics
   * Track which job roles are most viewed
   */
  async getJobRoleAnalytics(startDate = "30daysAgo", endDate = "today") {
    if (!this.client) {
      throw new Error("Analytics client not initialized");
    }

    try {
      const [response] = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [
          {
            startDate,
            endDate,
          },
        ],
        dimensions: [
          {
            name: "pagePath",
          },
        ],
        metrics: [
          {
            name: "screenPageViews",
          },
          {
            name: "averageSessionDuration",
          },
        ],
        dimensionFilter: {
          filter: {
            fieldName: "pagePath",
            stringFilter: {
              matchType: "CONTAINS" as const,
              value: "/job-roles/",
            },
          },
        },
        orderBys: [
          {
            metric: {
              metricName: "screenPageViews",
            },
            desc: true,
          },
        ],
        limit: 10,
      });

      return response;
    } catch (error) {
      console.error("Error fetching job role analytics:", error);
      throw error;
    }
  }

  /**
   * Get custom event data
   * @param eventName - The name of the custom event to track
   */
  async getEventData(
    eventName: string,
    startDate = "7daysAgo",
    endDate = "today"
  ) {
    if (!this.client) {
      throw new Error("Analytics client not initialized");
    }

    try {
      const [response] = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [
          {
            startDate,
            endDate,
          },
        ],
        dimensions: [
          {
            name: "eventName",
          },
        ],
        metrics: [
          {
            name: "eventCount",
          },
        ],
        dimensionFilter: {
          filter: {
            fieldName: "eventName",
            stringFilter: {
              matchType: "EXACT" as const,
              value: eventName,
            },
          },
        },
      });

      return response;
    } catch (error) {
      console.error("Error fetching event data:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();
