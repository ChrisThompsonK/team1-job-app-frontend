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
   * Renders the job role detail page
   * GET /job-roles/:name
   */
  public getJobRoleDetail = (req: Request, res: Response): void => {
    try {
      const jobNameParam = req.params.name;

      if (!jobNameParam) {
        res.status(400).render("error", {
          title: "Invalid Request",
          message: "Job name parameter is required",
          error: "Missing job name in the request URL.",
        });
      } else {
        const jobName = decodeURIComponent(jobNameParam);
        const jobRole = this.jobRoleService.getJobByName(jobName);
        if (!jobRole) {
          res.status(404).render("error", {
            title: "Job Not Found",
            message: `Job role "${jobName}" was not found`,
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
