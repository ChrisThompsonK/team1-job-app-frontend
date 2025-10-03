import axios from "axios";
import type { JobRole } from "../models/job-role.js";
import type { JobRoleservice } from "./interfaces.js";

export class JobRoleAPIService implements JobRoleservice {
  async getAllJobs(): Promise<JobRole[]> {
    const jobs: JobRole[] = [];
    const response = await axios.get<JobRole[]>(
      "http://localhost:3001/api/jobs"
    );
    jobs.push(...response.data);
    return jobs;
  }

  async getJobById(id: number): Promise<JobRole | undefined> {
    try {
      const response = await axios.get<JobRole>(
        `http://localhost:3001/api/jobs/${id}`
      );
      return response.data;
    } catch (_error) {
      return undefined;
    }
  }

  async getJobByName(name: string): Promise<JobRole | undefined> {
    try {
      const response = await axios.get<JobRole>(
        `http://localhost:3001/api/jobs/${name}`
      );
      return response.data;
    } catch (_error) {
      return undefined;
    }
  }
}
