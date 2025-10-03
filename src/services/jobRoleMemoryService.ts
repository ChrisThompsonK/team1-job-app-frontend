import type { JobRole } from "../models/job-role.js";
import type { JobRoleservice } from "./interfaces.js";

export class JobRoleMemoryService implements JobRoleservice {
  private jobRoles: JobRole[] = [];

  constructor(initialJobRoles: JobRole[]) {
    this.jobRoles = [...initialJobRoles];
  }

  async getAllJobs(): Promise<JobRole[]> {
    return this.jobRoles;
  }

  async getJobById(id: number): Promise<JobRole | undefined> {
    return this.jobRoles.find((job) => job.id === id);
  }

  async getJobByName(name: string): Promise<JobRole | undefined> {
    return this.jobRoles.find((job) => job.name === name);
  }
}
