import type { IjobRole } from "../models/job-role";
import type { jobRoleservice } from "./interfaces";

export class jobRole implements jobRoleservice {
  private jobRoles: IjobRole[] = [];

  constructor(initialJobRoles: IjobRole[]) {
    this.jobRoles = [...initialJobRoles];
  }
  getAllJobs(): IjobRole[] {
    return this.jobRoles;
  }
}
