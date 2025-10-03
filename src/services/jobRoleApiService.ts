import axios from "axios";
import type { JobRole } from "../models/job-role.js";
import type { JobRoleservice } from "./interfaces.js";

export class JobRoleApiService implements JobRoleservice {
  private baseURL: string;

  constructor(baseURL: string = "http://localhost:3001/api") {
    this.baseURL = baseURL;
  }

  async getAllJobs(): Promise<JobRole[]> {
    try {
      const response = await axios.get(`${this.baseURL}/jobs`);
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching jobs from API:", error);
      return [];
    }
  }

  async getJobById(id: number): Promise<JobRole | undefined> {
    try {
      const response = await axios.get(`${this.baseURL}/jobs/${id}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching job by ID from API:", error);
      return undefined;
    }
  }

  async getJobByName(name: string): Promise<JobRole | undefined> {
    try {
      const jobs = await this.getAllJobs();
      return jobs.find((job) => job.name === name);
    } catch (error) {
      console.error("Error fetching job by name from API:", error);
      return undefined;
    }
  }

  async deleteJobById(id: string): Promise<boolean> {
    try {
      const response = await axios.delete(`${this.baseURL}/jobs/${id}`);
      return response.status === 200;
    } catch (error) {
      console.error("Error deleting job via API:", error);
      return false;
    }
  }
}
