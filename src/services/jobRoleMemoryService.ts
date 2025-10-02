import type { JobRole } from "../models/job-role.js";
import type { JobRoleservice } from "./interfaces.js";

export class JobRoleMemoryService implements JobRoleservice {
  private jobRoles: JobRole[] = [];

  constructor(initialJobRoles: JobRole[]) {
    this.jobRoles = [...initialJobRoles];
  }

  getAllJobs(): JobRole[] {
    return this.jobRoles;
  }

  getJobById(id: number): JobRole | undefined {
    return this.jobRoles.find((job) => job.id === id);
  }

  getJobByName(name: string): JobRole | undefined {
    return this.jobRoles.find((job) => job.name === name);
  }
}
