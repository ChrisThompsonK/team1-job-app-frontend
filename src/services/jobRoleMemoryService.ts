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

  async deleteJobById(id: string): Promise<boolean> {
    // Just remove from local array (in-memory version)
    const initialLength = this.jobRoles.length;
    this.jobRoles = this.jobRoles.filter((job) => job.id.toString() !== id);
    return this.jobRoles.length < initialLength;
  }
}
