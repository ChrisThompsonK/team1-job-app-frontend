import type { JobRole } from "../models/job-role";
import type { jobRoleservice } from "./interfaces";

export class JobRoleMemoryService implements jobRoleservice {
  private jobRoles: JobRole[] = [];

  constructor(initialJobRoles: JobRole[]) {
    this.jobRoles = [...initialJobRoles];
  }
  getAllJobs(): JobRole[] {
    return this.jobRoles;
  }
}
