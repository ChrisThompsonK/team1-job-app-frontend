import type { JobRole } from "../models/job-role.js";
import type { JobRoleCreateData, JobRoleservice } from "./interfaces.js";

export class JobRoleMemoryService implements JobRoleservice {
  private jobRoles: JobRole[] = [];
  private nextId: number = 1;

  constructor(initialJobRoles: JobRole[]) {
    this.jobRoles = [...initialJobRoles];
    // Set nextId to be one higher than the highest existing ID
    this.nextId = Math.max(...this.jobRoles.map((job) => job.id), 0) + 1;
  }

  getAllJobs(): JobRole[] {
    return this.jobRoles;
  }

  addJob(jobData: JobRoleCreateData): JobRole {
    const newJob: JobRole = {
      id: this.nextId++,
      name: jobData.name,
      location: jobData.location,
      capability: jobData.capability,
      band: jobData.band,
      closingDate: jobData.closingDate,
      numberOfOpenPositions: jobData.numberOfOpenPositions,
      status: jobData.status,
      description: jobData.description,
      responsibilities: [...jobData.responsibilities],
    };

    this.jobRoles.push(newJob);
    return newJob;
  }
}
