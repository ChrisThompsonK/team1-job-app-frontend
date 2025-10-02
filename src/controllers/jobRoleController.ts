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
}
