import type { JobRole } from "../models/job-role.js";

export interface JobRoleservice {
  getAllJobs(): JobRole[];
  getJobByName(name: string): JobRole | undefined;
}
