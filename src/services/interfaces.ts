import type { JobRole } from "../models/job-role.js";

export interface JobRoleservice {
  getAllJobs(): JobRole[];
  getJobById(id: number): JobRole | undefined;
  getJobByName(name: string): JobRole | undefined;
}
