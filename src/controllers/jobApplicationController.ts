import type { Request, Response } from "express";

/**
 * Job Application controller for handling job application requests
 */
export class JobApplicationController {
  /**
   * Show job application form
   * GET /job-roles/:id/apply
   */
  public getJobApplication = (req: Request, res: Response): void => {
    // Mock job data for demonstration
    const mockJobRole = {
      id: req.params.id,
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
  };

  /**
   * Handle job application submission
   * POST /job-roles/:id/apply
   */
  public submitJobApplication = (req: Request, res: Response): void => {
    // Mock job data for demonstration
    const mockJobRole = {
      id: req.params.id,
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
  };
}
