import axios from "axios";
import type { JobRole } from "../models/job-role.js";
export class JobRoleAPIService {
  async getAllJobs(): Promise<JobRole[]> {
    const jobs: JobRole[] = [];
    const response = await axios.get<JobRole[]>(
      "http://localhost:3001/api/jobs"
    );
    jobs.push(...response.data);
    return jobs;
  }
}
