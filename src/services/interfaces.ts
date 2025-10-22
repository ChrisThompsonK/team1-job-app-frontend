import type { CreateJobRoleData, JobRole } from "../models/job-role.js";

export interface JobFilterParams {
  capability?: string;
  band?: string;
  location?: string;
  status?: string;
  search?: string;
  closingDateFrom?: string;
  closingDateTo?: string;
  minPositions?: number;
  maxPositions?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface FilteredJobsResponse {
  jobs: JobRole[];
  pagination: PaginationInfo;
  filters: Record<string, unknown>;
}

export interface JobRoleservice {
  getAllJobs(): JobRole[] | Promise<JobRole[]>;
  getJobById(id: number): JobRole | undefined | Promise<JobRole | undefined>;
  getJobByName(
    name: string
  ): JobRole | undefined | Promise<JobRole | undefined>;
  createJob(
    jobData: CreateJobRoleData,
    cookies?: { [key: string]: string }
  ): Promise<JobRole | null>;
  deleteJobById(
    id: string,
    cookies?: { [key: string]: string }
  ): Promise<boolean>;
  updateJobById(
    id: number,
    jobData: CreateJobRoleData,
    cookies?: { [key: string]: string }
  ): Promise<JobRole | null>;
  getFilteredJobs(
    filters?: JobFilterParams
  ): Promise<FilteredJobsResponse> | FilteredJobsResponse;
}
