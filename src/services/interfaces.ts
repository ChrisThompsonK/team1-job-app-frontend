import type { JobRole } from "../models/job-role.js";

export interface JobRoleservice {
  getAllJobs(): JobRole[] | Promise<JobRole[]>;
  getJobById(id: number): JobRole | undefined | Promise<JobRole | undefined>;
  getJobByName(
    name: string
  ): JobRole | undefined | Promise<JobRole | undefined>;
  deleteJobById(id: string): Promise<boolean>;
}
