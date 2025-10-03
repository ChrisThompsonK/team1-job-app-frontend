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
    try {
      // Call backend API to delete the job
      const backendUrl = `http://localhost:3001/api/jobs/${id}`;
      const response = await fetch(backendUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        // Also remove from local array to keep it in sync
        this.jobRoles = this.jobRoles.filter((job) => job.id.toString() !== id);
        return true;
      } else {
        console.error("Failed to delete job from backend:", await response.text());
        return false;
      }
    } catch (error) {
      console.error("Error calling backend delete API:", error);
      return false;
    }
  }
}
