import type { JobRole } from "../models/job-role.js";

export interface JobRoleservice {
  getAllJobs(): Promise<JobRole[]>;
  getJobById(id: number): Promise<JobRole | undefined>;
  getJobByName(name: string): Promise<JobRole | undefined>;
}

export interface JobRoleAPIService {
  getAllJobs(): Promise<JobRole[]>;
}
