import type { JobRole } from "../models/job-role";
import type { JobRoleservice } from "./interfaces";

export class JobRoleMemoryService implements JobRoleservice {
  private jobRoles: JobRole[] = [];

  constructor(initialJobRoles: JobRole[]) {
    this.jobRoles = [...initialJobRoles];
  }
  getAllJobs(): JobRole[] {
    return this.jobRoles;
  }
}
