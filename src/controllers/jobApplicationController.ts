import type { Request, Response } from "express";
import type { JobRoleservice } from "../services/interfaces.js";
import { decodeJobId } from "../utils/jobSecurity.js";

/**
 * Job Application controller for handling job application requests
 */
export class JobApplicationController {
  private jobRoleService: JobRoleservice;

  constructor(jobRoleService: JobRoleservice) {
    this.jobRoleService = jobRoleService;
  }
  /**
   * Show job application form
   * GET /job-roles/:id/apply
   */
  public getJobApplication = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      // Decode the job ID from the URL parameter
      const encodedId = req.params.id;
      if (!encodedId) {
        throw new Error("No job ID provided");
      }
      const decodedJobId = decodeJobId(encodedId);

      // Fetch real job data from backend
      const jobRole = await this.jobRoleService.getJobById(
        Number(decodedJobId)
      );

      if (!jobRole) {
        res.status(404).render("error", {
          title: "Job Not Found",
          message: "The job you're looking for could not be found.",
          error: "Job not found",
        });
        return;
      }

      // Extract user data from cookies for autofill
      const userName = req.cookies?.userName || "";
      const userEmail = req.cookies?.userEmail || "";

      // Split userName into first and last name (basic implementation)
      const nameParts = userName.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      // Prepare user data for autofill
      const userData = {
        firstName,
        lastName,
        email: userEmail,
      };

      res.render("job-application", {
        title: `Apply for ${jobRole.name}`,
        jobRole: jobRole,
        currentPage: "job-roles",
        userData,
      });
    } catch (error) {
      console.error("Error loading job application form:", error);
      res.status(400).render("error", {
        title: "Invalid Job",
        message: "The job you're looking for could not be found.",
        error: "Invalid job ID",
      });
    }
  };

  /**
   * Handle job application submission
   * POST /job-roles/:id/apply
   */
  public submitJobApplication = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      // Decode the job ID from the URL parameter
      const encodedId = req.params.id;
      if (!encodedId) {
        throw new Error("No job ID provided");
      }
      const decodedJobId = Number(decodeJobId(encodedId));

      // Get the job data to display in case of success or error
      const jobRole = await this.jobRoleService.getJobById(decodedJobId);

      if (!jobRole) {
        res.status(404).render("error", {
          title: "Job Not Found",
          message: "The job you're looking for could not be found.",
          error: "Job not found",
        });
        return;
      }

      // This endpoint will be used for non-AJAX fallback
      // Show success message (the actual submission will be handled by AJAX in the frontend)
      // Extract user data from cookies for autofill (in case of re-render)
      const userName = req.cookies?.userName || "";
      const userEmail = req.cookies?.userEmail || "";

      // Split userName into first and last name (basic implementation)
      const nameParts = userName.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      // Prepare user data for autofill
      const userData = {
        firstName,
        lastName,
        email: userEmail,
      };

      // Just show success message without processing anything
      res.render("job-application", {
        title: `Apply for ${jobRole.name}`,
        jobRole: jobRole,
        currentPage: "job-roles",
        userData,
        success: req.t("jobApplication.applicationSubmitted"),
      });
    } catch (error) {
      console.error("Error submitting job application:", error);

      try {
        const decodedJobId = Number(decodeJobId(req.params.id || ""));
        const jobRole = await this.jobRoleService.getJobById(decodedJobId);

        if (jobRole) {
          res.status(400).render("job-application", {
            title: `Apply for ${jobRole.name}`,
            jobRole: jobRole,
            currentPage: "job-roles",
            error:
              error instanceof Error
                ? error.message
                : "Failed to submit application",
            formData: req.body,
          });
          return;
        }
      } catch {
        // Fall through to generic error
      }

      res.status(400).render("error", {
        title: "Application Error",
        message: "Failed to submit your application.",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
}
