import type { Request, Response } from "express";
import { decodeJobId } from "../utils/jobSecurity.js";

/**
 * Job Application controller for handling job application requests
 */
export class JobApplicationController {
  /**
   * Show job application form
   * GET /job-roles/:id/apply
   */
  public getJobApplication = (req: Request, res: Response): void => {
    try {
      // Decode the job ID from the URL parameter
      const encodedId = req.params.id;
      if (!encodedId) {
        throw new Error("No job ID provided");
      }
      const decodedJobId = decodeJobId(encodedId);

      // Mock job data for demonstration
      const mockJobRole = {
        id: decodedJobId,
        name: "Software Developer",
        location: "Belfast, UK",
        capability: "Engineering",
        band: "Senior",
        closingDate: new Date("2024-12-31"),
      };

      res.render("job-application", {
        title: `Apply for ${mockJobRole.name}`,
        jobRole: mockJobRole,
        currentPage: "job-roles",
      });
    } catch (_error) {
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
  public submitJobApplication = (req: Request, res: Response): void => {
    try {
      // Decode the job ID from the URL parameter
      const encodedId = req.params.id;
      if (!encodedId) {
        throw new Error("No job ID provided");
      }
      const decodedJobId = decodeJobId(encodedId);

      // Mock job data for demonstration
      const mockJobRole = {
        id: decodedJobId,
        name: "Software Developer",
        location: "Belfast, UK",
        capability: "Engineering",
        band: "Senior",
        closingDate: new Date("2024-12-31"),
      };

      // Just show success message without processing anything
      res.render("job-application", {
        title: `Apply for ${mockJobRole.name}`,
        jobRole: mockJobRole,
        currentPage: "job-roles",
        success: req.t("jobApplication.applicationSubmitted"),
      });
    } catch (_error) {
      res.status(400).render("error", {
        title: "Invalid Job",
        message: "The job you're looking for could not be found.",
        error: "Invalid job ID",
      });
    }
  };
}
