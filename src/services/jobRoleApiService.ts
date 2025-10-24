import axios from "axios";
import { PAGINATION_CONFIG } from "../config/pagination.js";
import type { CreateJobRoleData, JobRole } from "../models/job-role.js";
import { createHeadersWithAuth } from "../utils/cookieUtils.js";
import type {
  FilteredJobsResponse,
  JobFilterParams,
  JobRoleservice,
} from "./interfaces.js";
import { JobRoleMapper } from "./jobRoleMapper.js";

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

interface ApiResponse<T> {
  data: T;
}

export class JobRoleApiService implements JobRoleservice {
  private baseURL: string;
  private mapper: JobRoleMapper;

  constructor(baseURL: string = "http://localhost:3001/api") {
    this.baseURL = baseURL;
    this.mapper = new JobRoleMapper();
  }

  async getAllJobs(): Promise<JobRole[]> {
    try {
      const response = await axios.get<ApiResponse<JobRole[]>>(
        `${this.baseURL}/jobs`
      );
      const jobs = response.data.data || [];
      const { mappedJobs } = this.mapper.mapJobs(jobs);

      return mappedJobs;
    } catch (error) {
      console.error("Error fetching jobs from API:", error);
      return [];
    }
  }

  async getJobById(id: number): Promise<JobRole | undefined> {
    try {
      const response = await axios.get<ApiResponse<JobRole>>(
        `${this.baseURL}/jobs/${id}`
      );
      if (!response.data.data) {
        return undefined;
      }

      const mappedJob = this.mapper.mapJob(response.data.data);

      // Return undefined if mapping failed
      if (mappedJob === null) {
        console.error(
          `Failed to map job with ID ${id} due to invalid data format`
        );
        return undefined;
      }

      return mappedJob;
    } catch (error) {
      console.error(`Error fetching job with ID ${id} from API:`, error);
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

  async createJob(
    jobData: CreateJobRoleData,
    cookies?: { [key: string]: string }
  ): Promise<JobRole | null> {
    try {
      // Create headers with authentication cookies
      const headers = createHeadersWithAuth(cookies, {
        "Content-Type": "application/json",
      });

      const response = await axios.post<ApiResponse<JobRole>>(
        `${this.baseURL}/jobs`,
        jobData,
        { headers }
      );

      // Check if the response has data property
      if (response.data?.data) {
        const mappedJob = this.mapper.mapJob(response.data.data);
        return mappedJob || null;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error creating job:", error);
      return null;
    }
  }

  async deleteJobById(
    id: string,
    cookies?: { [key: string]: string }
  ): Promise<boolean> {
    try {
      // Create headers with authentication cookies
      const headers = createHeadersWithAuth(cookies);

      const response = await axios.delete(`${this.baseURL}/jobs/${id}`, {
        headers,
      });

      if (response.status === 200) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting job:", error);
      return false;
    }
  }

  async updateJobById(
    id: number,
    jobData: CreateJobRoleData,
    cookies?: { [key: string]: string }
  ): Promise<JobRole | null> {
    try {
      // Create headers with authentication cookies
      const headers = createHeadersWithAuth(cookies, {
        "Content-Type": "application/json",
      });

      // The jobData is already in the backend format from the controller
      const response = await axios.put<ApiResponse<JobRole>>(
        `${this.baseURL}/jobs/${id}`,
        jobData,
        { headers }
      );

      // Check if the response has data property
      if (response.data?.data) {
        const mappedJob = this.mapper.mapJob(response.data.data);
        return mappedJob || null;
      } else {
        // If no data but successful response, try to fetch the updated job
        if (response.status === 200) {
          const fetchedJob = await this.getJobById(id);
          return fetchedJob || null;
        }
      }

      return null;
    } catch (error) {
      console.error(`Error updating job (ID: ${id}):`, error);
      return null;
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

      const jobs = response.data.data || [];
      const { mappedJobs } = this.mapper.mapJobs(jobs);

      return {
        jobs: mappedJobs,
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
          itemsPerPage: PAGINATION_CONFIG.defaultItemsPerPage,
        },
        filters: {},
      };
    }
  }
}
