import type { Request, Response } from "express";
import { JobRoleMemoryService } from "../services/jobRoleMemoryService.js";
import { ProvideJobRoles } from "../services/jobRoleProvider.js";

export class JobRoleController {
  /**
   * Renders the job roles list page
   * GET /job-roles
   */
  public static getJobRolesList(_req: Request, res: Response): void {
    try {
      const jobs = ProvideJobRoles();
      const jobRoleService = new JobRoleMemoryService(jobs);
      const jobRoles = jobRoleService.getAllJobs();

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
  }
}
