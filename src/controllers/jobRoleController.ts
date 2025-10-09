import type { Request, Response } from "express";
import type { JobRoleservice } from "../services/interfaces.js";

export class JobRoleController {
  constructor(private jobRoleService: JobRoleservice) {}

  /**
   * Renders the job roles list page
   * GET /job-roles
   */
  public getJobRolesList = async (
    _req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const jobRoles = await this.jobRoleService.getAllJobs();

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

      // Call service to delete the job
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
  public getJobRoleDetail = async (
    req: Request,
    res: Response
  ): Promise<void> => {
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

        if (Number.isNaN(jobId)) {
          res.status(400).render("error", {
            title: "Invalid Request",
            message: "Job ID must be a valid number",
            error: "The provided job ID is not a valid number.",
          });
          return;
        }

        const jobRole = await this.jobRoleService.getJobById(jobId);

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

  /**
   * Renders the job role edit page
   * GET /job-roles/:id/edit
   */
  public getJobRoleEdit = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const jobIdParam = req.params.id;

      if (!jobIdParam) {
        res.status(400).render("error", {
          title: "Invalid Request",
          message: "Job ID parameter is required",
          error: "Missing job ID in the request URL.",
        });
        return;
      }

      const jobId = parseInt(jobIdParam, 10);

      if (Number.isNaN(jobId)) {
        res.status(400).render("error", {
          title: "Invalid Request",
          message: "Job ID must be a valid number",
          error: "The provided job ID is not a valid number.",
        });
        return;
      }

      const jobRole = await this.jobRoleService.getJobById(jobId);

      if (!jobRole) {
        res.status(404).render("error", {
          title: "Job Not Found",
          message: `Job role with ID "${jobId}" was not found`,
          error: "The requested job role does not exist or has been removed.",
        });
        return;
      }

      res.render("job-role-edit", {
        title: `Edit ${jobRole.name}`,
        job: jobRole,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error fetching job role for edit:", error);
      res.status(500).render("error", {
        title: "Error",
        message: "Unable to fetch job role for editing",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  /**
   * Handles job role edit form submission
   * POST /job-roles/:id/edit
   */
  public updateJobRole = async (req: Request, res: Response): Promise<void> => {
    console.log(
      "[Controller] updateJobRole called with params:",
      req.params,
      "and body:",
      req.body
    );
    try {
      const jobIdParam = req.params.id;

      if (!jobIdParam) {
        res.status(400).render("error", {
          title: "Invalid Request",
          message: "Job ID parameter is required",
          error: "Missing job ID in the request URL.",
        });
        return;
      }

      const jobId = parseInt(jobIdParam, 10);

      if (Number.isNaN(jobId)) {
        res.status(400).render("error", {
          title: "Invalid Request",
          message: "Job ID must be a valid number",
          error: "The provided job ID is not a valid number.",
        });
        return;
      }

      // Extract form data
      const {
        jobRoleName,
        location,
        capability,
        band,
        status,
        numberOfOpenPositions,
        closingDate,
        jobSpecLink,
        description,
        responsibilities,
      } = req.body;

      // Validate required fields (jobSpecLink is now optional)
      if (
        !jobRoleName ||
        !location ||
        !capability ||
        !band ||
        !status ||
        !numberOfOpenPositions ||
        !closingDate ||
        !description ||
        !responsibilities
      ) {
        const jobRole = await this.jobRoleService.getJobById(jobId);
        res.render("job-role-edit", {
          title: `Edit ${jobRole?.name || "Job Role"}`,
          job: jobRole,
          error:
            "Required fields are missing. Please fill in all required form fields.",
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Prepare job data for update
      const jobData = {
        jobRoleName,
        location,
        capability,
        band,
        status,
        numberOfOpenPositions: parseInt(numberOfOpenPositions, 10),
        closingDate: closingDate, // Keep as string, don't convert to Date object
        description,
        responsibilities: responsibilities
          .split(",")
          .map((r: string) => r.trim()),
      };

      // Add jobSpecLink only if provided
      if (jobSpecLink && jobSpecLink.trim()) {
        (jobData as any).jobSpecLink = jobSpecLink.trim();
      }

      // Update the job
      console.log(`[Controller] Updating job ${jobId} with data:`, jobData);
      const updatedJob = await this.jobRoleService.updateJobById(
        jobId,
        jobData
      );
      console.log(`[Controller] Result from service:`, updatedJob);

      if (updatedJob) {
        // Success - redirect back to job roles list with success message
        console.log(
          `[Controller] Update successful, redirecting to /job-roles`
        );
        res.redirect("/job-roles?message=Job updated successfully");
      } else {
        console.log(
          `[Controller] Update failed - service returned null/undefined`
        );
        // Error from service - re-render form with error
        const jobRole = await this.jobRoleService.getJobById(jobId);
        res.render("job-role-edit", {
          title: `Edit ${jobRole?.name || "Job Role"}`,
          job: jobRole,
          error: "Failed to update job role. Please try again.",
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error updating job role:", error);

      // Try to re-render the form with error message
      try {
        const jobIdParam = req.params.id;
        if (jobIdParam) {
          const jobId = parseInt(jobIdParam, 10);
          const jobRole = await this.jobRoleService.getJobById(jobId);

          res.status(500).render("job-role-edit", {
            title: `Edit ${jobRole?.name || "Job Role"}`,
            job: jobRole,
            error:
              error instanceof Error
                ? error.message
                : "An error occurred while updating the job role",
            timestamp: new Date().toISOString(),
          });
        } else {
          throw new Error("Missing job ID");
        }
      } catch (_renderError) {
        // If we can't even render the form, show generic error page
        res.status(500).render("error", {
          title: "Update Failed",
          message: "An error occurred while updating the job role",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
  };
}
