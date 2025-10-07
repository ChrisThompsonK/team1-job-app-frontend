import axios from "axios";
import type { JobRole } from "../models/job-role.js";
import { JobStatus } from "../models/job-role.js";
import type {
  FilteredJobsResponse,
  JobFilterParams,
  JobRoleservice,
} from "./interfaces.js";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  count?: number;
}

interface FilteredApiResponse {
  success: boolean;
  message: string;
  data: JobRole[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  filters: Record<string, unknown>;
}

export class JobRoleApiService implements JobRoleservice {
  private baseURL: string;

  constructor(baseURL: string = "http://localhost:3001/api") {
    this.baseURL = baseURL;
  }

  // Helper method to normalize status values between backend and frontend
  private normalizeStatus(status: string): JobStatus {
    if (!status) return JobStatus.Open;
    const lowerStatus = status.toLowerCase();
    if (lowerStatus === "open") return JobStatus.Open;
    if (lowerStatus === "closed") return JobStatus.Closed;
    if (lowerStatus === "draft") return JobStatus.Open; // Map draft to Open for frontend
    return JobStatus.Open; // Default fallback
  }

  // Helper method to map backend job data to frontend structure
  private mapJobData(job: unknown): JobRole {
    const jobData = job as Partial<JobRole> & { jobRoleName?: string };
    return {
      id: jobData.id ?? 0,
      name: jobData.name ?? jobData.jobRoleName ?? "Untitled Job",
      status: this.normalizeStatus((jobData.status as string) ?? ""),
      closingDate:
        typeof jobData.closingDate === "string"
          ? new Date(jobData.closingDate)
          : (jobData.closingDate ?? new Date()),
      numberOfOpenPositions: jobData.numberOfOpenPositions ?? 1,
      description: jobData.description ?? "",
      responsibilities: jobData.responsibilities ?? [],
      location: jobData.location ?? "",
      capability: jobData.capability ?? ("" as never),
      band: jobData.band ?? ("" as never),
    };
  }

  async getAllJobs(): Promise<JobRole[]> {
    try {
      const response = await axios.get<ApiResponse<unknown[]>>(
        `${this.baseURL}/jobs`
      );
      const jobs = response.data.data || [];

      // Map backend data structure to frontend structure
      return jobs.map((job) => this.mapJobData(job));
    } catch (error) {
      console.error("Error fetching jobs from API:", error);
      return [];
    }
  }

  async getJobById(id: number): Promise<JobRole | undefined> {
    try {
      const response = await axios.get<ApiResponse<unknown>>(
        `${this.baseURL}/jobs/${id}`
      );
      if (response.data.data) {
        return this.mapJobData(response.data.data);
      }
      return undefined;
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

  async getFilteredJobs(
    filters?: JobFilterParams
  ): Promise<FilteredJobsResponse> {
    try {
      // Build query parameters
      const params = new URLSearchParams();

      if (filters) {
        if (filters.capability) params.append("capability", filters.capability);
        if (filters.band) params.append("band", filters.band);
        if (filters.location) params.append("location", filters.location);
        if (filters.status) params.append("status", filters.status);
        if (filters.search) params.append("search", filters.search);
        if (filters.closingDateFrom)
          params.append("closingDateFrom", filters.closingDateFrom);
        if (filters.closingDateTo)
          params.append("closingDateTo", filters.closingDateTo);
        if (filters.minPositions !== undefined)
          params.append("minPositions", filters.minPositions.toString());
        if (filters.maxPositions !== undefined)
          params.append("maxPositions", filters.maxPositions.toString());
        if (filters.page !== undefined)
          params.append("page", filters.page.toString());
        if (filters.limit !== undefined)
          params.append("limit", filters.limit.toString());
        if (filters.sortBy) params.append("sortBy", filters.sortBy);
        if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);
      }

      const queryString = params.toString();
      const url = queryString
        ? `${this.baseURL}/jobs/search?${queryString}`
        : `${this.baseURL}/jobs/search`;

      const response = await axios.get<FilteredApiResponse>(url);

      return {
        jobs: response.data.data
          ? response.data.data.map((job) => this.mapJobData(job))
          : [],
        pagination: response.data.pagination,
        filters: response.data.filters,
      };
    } catch (error) {
      console.error("Error fetching filtered jobs from API:", error);
      return {
        jobs: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: 10,
        },
        filters: {},
      };
    }
  }
}
