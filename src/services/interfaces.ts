import type {
  Band,
  Capability,
  JobRole,
  JobStatus,
} from "../models/job-role.js";

export interface JobRoleCreateData {
  name: string;
  location: string;
  capability: Capability;
  band: Band;
  closingDate: Date;
  numberOfOpenPositions: number;
  status: JobStatus;
  description: string;
  responsibilities: string[];
}

export interface JobRoleservice {
  getAllJobs(): JobRole[];
  addJob(jobData: JobRoleCreateData): JobRole;
}
