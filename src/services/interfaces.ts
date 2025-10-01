import type { JobRole } from "../models/job-role";

export interface JobRoleservice {
  getAllJobs(): JobRole[];
}
