import type { Request, Response } from "express";
import { ApplicationApiService } from "../services/applicationApiService.js";
import { authService } from "../services/authService.js";

/**
 * Controller for handling applicants management (admin only)
 */
export class ApplicantsController {
  private applicationApiService: ApplicationApiService;

  constructor(applicationApiService?: ApplicationApiService) {
    this.applicationApiService =
      applicationApiService || new ApplicationApiService();
  }

  /**
   * Renders the applicants list page with all applications
   * GET /applicants
   * Requires admin authentication
   */
  public getApplicantsList = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      console.log("🔍 Applicants page requested:", {
        url: req.url,
        cookies: Object.keys(req.cookies || {}),
        timestamp: new Date().toISOString(),
      });

      // Check admin authentication first
      console.log("🔐 Checking admin authentication...");
      const user = await authService.getUserFromSession(req.cookies);

      console.log("👤 Authentication result:", {
        hasUser: !!user,
        isAdmin: user?.isAdmin || false,
        userEmail: user?.email || "NO EMAIL",
      });

      if (!user || !user.isAdmin) {
        console.log("❌ Access denied - not admin");
        res.status(403).render("error", {
          title: "Access Denied",
          message: "Admin access required",
          error: "You must be an administrator to view job applicants.",
        });
        return;
      }

      console.log("✅ Admin access confirmed, fetching applications...");
      // Fetch all applications from the API
      const response = await this.applicationApiService.getAllApplications(
        req.cookies
      );

      // Get filter parameters from query
      const filters = {
        jobRole: (req.query.jobRole as string) || "",
        status: (req.query.status as string) || "",
        capability: (req.query.capability as string) || "",
        band: (req.query.band as string) || "",
        search: (req.query.search as string) || "",
      };

      // Apply client-side filtering
      let filteredApplications = response.data;

      if (filters.jobRole) {
        filteredApplications = filteredApplications.filter((app) =>
          app.jobRoleName.toLowerCase().includes(filters.jobRole.toLowerCase())
        );
      }

      if (filters.status) {
        filteredApplications = filteredApplications.filter(
          (app) =>
            app.applicationStatus?.toLowerCase() ===
            filters.status.toLowerCase()
        );
      }

      if (filters.capability) {
        filteredApplications = filteredApplications.filter(
          (app) =>
            app.jobCapability.toLowerCase() === filters.capability.toLowerCase()
        );
      }

      if (filters.band) {
        filteredApplications = filteredApplications.filter(
          (app) => app.jobBand.toLowerCase() === filters.band.toLowerCase()
        );
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredApplications = filteredApplications.filter(
          (app) =>
            app.applicantName?.toLowerCase().includes(searchTerm) ||
            app.applicantEmail.toLowerCase().includes(searchTerm) ||
            app.jobRoleName.toLowerCase().includes(searchTerm)
        );
      }

      // Simple pagination
      const page = Math.max(
        1,
        Number.parseInt(req.query.page as string, 10) || 1
      );
      const limit = 20; // Show 20 applications per page
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedApplications = filteredApplications.slice(
        startIndex,
        endIndex
      );

      // Generate pagination data
      const totalPages = Math.ceil(filteredApplications.length / limit);
      const pagination = {
        currentPage: page,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
        startIndex: startIndex + 1,
        endIndex: Math.min(endIndex, filteredApplications.length),
        totalItems: filteredApplications.length,
      };

      // Get unique values for filter options
      const uniqueJobRoles = [
        ...new Set(response.data.map((app) => app.jobRoleName)),
      ].sort();
      const uniqueCapabilities = [
        ...new Set(response.data.map((app) => app.jobCapability)),
      ].sort();
      const uniqueBands = [
        ...new Set(response.data.map((app) => app.jobBand)),
      ].sort();
      const uniqueStatuses = [
        ...new Set(
          response.data.map((app) => app.applicationStatus).filter(Boolean)
        ),
      ].sort();

      res.render("applicants", {
        title: "Job Applicants",
        applications: paginatedApplications,
        pagination,
        filters,
        filterOptions: {
          jobRoles: uniqueJobRoles,
          capabilities: uniqueCapabilities,
          bands: uniqueBands,
          statuses: uniqueStatuses,
        },
        totalApplications: response.count,
        timestamp: new Date().toISOString(),
        user,
        isAuthenticated: true,
        isAdmin: true,
      });
    } catch (error) {
      console.error("Error fetching applicants:", error);

      // Check if it's an authentication/authorization error
      if (error instanceof Error) {
        if (error.message.includes("Admin privileges required")) {
          res.status(403).render("error", {
            title: "Access Denied",
            message: "Admin access required",
            error: "You must be an administrator to view job applicants.",
          });
          return;
        }

        if (error.message.includes("Authentication required")) {
          res.redirect(
            `/login?returnTo=${encodeURIComponent(req.originalUrl)}`
          );
          return;
        }
      }

      res.status(500).render("error", {
        title: "Error",
        message: "Unable to fetch applicants",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  /**
   * Export applicants data as CSV
   * GET /applicants/export
   * Requires admin authentication
   */
  public exportApplicantsCSV = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      // Check admin authentication first
      const user = await authService.getUserFromSession(req.cookies);
      if (!user || !user.isAdmin) {
        res.status(403).render("error", {
          title: "Access Denied",
          message: "Admin access required",
          error: "You must be an administrator to export applicant data.",
        });
        return;
      }

      // Fetch all applications from the API
      const response = await this.applicationApiService.getAllApplications(
        req.cookies
      );

      // Generate CSV content
      const csvHeaders = [
        "Application ID",
        "Job Role",
        "Applicant Name",
        "Applicant Email",
        "Status",
        "Applied Date",
        "Job Band",
        "Job Capability",
        "Job Location",
        "Job Closing Date",
      ];

      const csvRows = response.data.map((app) => [
        app.id.toString(),
        `"${app.jobRoleName}"`,
        `"${app.applicantName || "N/A"}"`,
        `"${app.applicantEmail}"`,
        `"${app.applicationStatus || "Pending"}"`,
        app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "N/A",
        `"${app.jobBand}"`,
        `"${app.jobCapability}"`,
        `"${app.jobLocation}"`,
        app.jobClosingDate
          ? new Date(app.jobClosingDate).toLocaleDateString()
          : "N/A",
      ]);

      const csvContent = [
        csvHeaders.join(","),
        ...csvRows.map((row) => row.join(",")),
      ].join("\n");

      // Set headers for CSV download
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="job-applicants-${new Date().toISOString().split("T")[0]}.csv"`
      );

      res.send(csvContent);
    } catch (error) {
      console.error("Error exporting applicants CSV:", error);

      if (
        error instanceof Error &&
        error.message.includes("Admin privileges required")
      ) {
        res.status(403).render("error", {
          title: "Access Denied",
          message: "Admin access required",
          error: "You must be an administrator to export applicant data.",
        });
        return;
      }

      res.status(500).render("error", {
        title: "Export Error",
        message: "Unable to export applicant data",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
}
