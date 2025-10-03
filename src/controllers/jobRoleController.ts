import type { Request, Response } from "express";
import type { JobRoleservice } from "../services/interfaces.js";

export class JobRoleController {
  constructor(private jobRoleService: JobRoleservice) {}

  /**
   * Renders the job roles list page
   * GET /job-roles
   */
  public getJobRolesList = (_req: Request, res: Response): void => {
    try {
      const jobRoles = this.jobRoleService.getAllJobs();

      res.render("job-role-list", {
        title: "Available Job Roles",
        jobRoles,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error fetching job roles:", error);
      res.status(500).render("error", {
        title: "Error",
        message: "Unable to fetch job roles",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  /**
   * Handles job role deletion
   * POST /job-roles/:id/delete
   */
  public deleteJobRole = async (req: Request, res: Response): Promise<void> => {
    try {
      const jobId = req.params.id;

      if (!jobId) {
        res.status(400).render("error", {
          title: "Error",
          message: "Job ID is required",
          error: "Invalid job ID provided",
        });
        return;
      }

      // Call service to delete the job (service handles API communication)
      const success = await this.jobRoleService.deleteJobById(jobId);

      if (success) {
        // Success - redirect back to job roles list
        res.redirect("/job-roles?message=Job deleted successfully");
      } else {
        // Error from service
        res.status(500).render("error", {
          title: "Delete Failed",
          message: "Failed to delete job role",
          error: "Unable to delete the job role. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      res.status(500).render("error", {
        title: "Error",
        message: "An error occurred while deleting the job",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  /**
   * Renders the job role detail page
   * GET /job-roles/:id
   */
  public getJobRoleDetail = (req: Request, res: Response): void => {
    try {
      const jobIdParam = req.params.id;

      if (!jobIdParam) {
        res.status(400).render("error", {
          title: "Invalid Request",
          message: "Job ID parameter is required",
          error: "Missing job ID in the request URL.",
        });
      } else {
        const jobId = parseInt(jobIdParam, 10);

        if (isNaN(jobId)) {
          res.status(400).render("error", {
            title: "Invalid Request",
            message: "Job ID must be a valid number",
            error: "The provided job ID is not a valid number.",
          });
          return;
        }

        const jobRole = this.jobRoleService.getJobById(jobId);
        if (!jobRole) {
          res.status(404).render("error", {
            title: "Job Not Found",
            message: `Job role with ID "${jobId}" was not found`,
            error: "The requested job role does not exist or has been removed.",
          });
        } else {
          res.render("job-role-detail", {
            title: `${jobRole.name} - Job Details`,
            jobRole,
            timestamp: new Date().toISOString(),
          });
        }
      }
    } catch (error) {
      console.error("Error fetching job role detail:", error);
      res.status(500).render("error", {
        title: "Error",
        message: "Unable to fetch job role details",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
}
