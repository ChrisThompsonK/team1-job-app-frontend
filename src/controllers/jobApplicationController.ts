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
        title: `Apply for ${mockJobRole.name}`,
        jobRole: mockJobRole,
        currentPage: "job-roles",
        userData,
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
        title: `Apply for ${mockJobRole.name}`,
        jobRole: mockJobRole,
        currentPage: "job-roles",
        userData,
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
