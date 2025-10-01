import type { Request, Response } from "express";
import type { JobRoleMemoryService } from "../services/jobRoleMemoryService.js";

export class JobRoleController {
  constructor(private jobRoleService: JobRoleMemoryService) {}

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
   * Returns job roles as JSON
   * GET /api/jobs
   */
  public getJobRolesApi = (_req: Request, res: Response): void => {
    try {
      const jobRoles = this.jobRoleService.getAllJobs();
      res.json(jobRoles);
    } catch (error) {
      console.error("Error fetching job roles:", error);
      res.status(500).json({
        error: "Unable to fetch job roles",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
}
