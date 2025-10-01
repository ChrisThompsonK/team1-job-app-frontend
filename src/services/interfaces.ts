import type { JobRole } from "../models/job-role";

export interface jobRoleservice {
  getAllJobs(): JobRole[];
}
