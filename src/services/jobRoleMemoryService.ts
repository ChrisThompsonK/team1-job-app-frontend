import type { JobRole } from "../models/job-role.js";
import type { JobRoleservice, FilteredJobsResponse, JobFilterParams } from "./interfaces.js";

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

  getFilteredJobs(filters?: JobFilterParams): FilteredJobsResponse {
    // In-memory filtering implementation
    let filteredJobs = [...this.jobRoles];

    if (filters) {
      // Filter by capability
      if (filters.capability) {
        filteredJobs = filteredJobs.filter(
          (job) => job.capability.toLowerCase() === filters.capability?.toLowerCase()
        );
      }

      // Filter by band
      if (filters.band) {
        filteredJobs = filteredJobs.filter(
          (job) => job.band.toLowerCase() === filters.band?.toLowerCase()
        );
      }

      // Filter by location (partial match)
      if (filters.location) {
        filteredJobs = filteredJobs.filter((job) =>
          job.location.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }

      // Filter by status
      if (filters.status) {
        filteredJobs = filteredJobs.filter(
          (job) => job.status.toLowerCase() === filters.status?.toLowerCase()
        );
      }

      // Text search across job title, description, and responsibilities
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredJobs = filteredJobs.filter(
          (job) =>
            job.name.toLowerCase().includes(searchTerm) ||
            job.description.toLowerCase().includes(searchTerm) ||
            job.responsibilities.some((resp) =>
              resp.toLowerCase().includes(searchTerm)
            )
        );
      }

      // Filter by closing date range
      if (filters.closingDateFrom) {
        const fromDate = new Date(filters.closingDateFrom);
        filteredJobs = filteredJobs.filter(
          (job) => new Date(job.closingDate) >= fromDate
        );
      }

      if (filters.closingDateTo) {
        const toDate = new Date(filters.closingDateTo);
        filteredJobs = filteredJobs.filter(
          (job) => new Date(job.closingDate) <= toDate
        );
      }

      // Filter by number of positions
      if (filters.minPositions !== undefined) {
        filteredJobs = filteredJobs.filter(
          (job) => job.numberOfOpenPositions >= filters.minPositions!
        );
      }

      if (filters.maxPositions !== undefined) {
        filteredJobs = filteredJobs.filter(
          (job) => job.numberOfOpenPositions <= filters.maxPositions!
        );
      }

      // Sorting
      if (filters.sortBy) {
        filteredJobs.sort((a, b) => {
          let aValue: any;
          let bValue: any;

          switch (filters.sortBy) {
            case "jobRoleName":
              aValue = a.name;
              bValue = b.name;
              break;
            case "closingDate":
              aValue = new Date(a.closingDate);
              bValue = new Date(b.closingDate);
              break;
            case "band":
              aValue = a.band;
              bValue = b.band;
              break;
            case "capability":
              aValue = a.capability;
              bValue = b.capability;
              break;
            case "location":
              aValue = a.location;
              bValue = b.location;
              break;
            default:
              return 0;
          }

          if (aValue < bValue) return filters.sortOrder === "desc" ? 1 : -1;
          if (aValue > bValue) return filters.sortOrder === "desc" ? -1 : 1;
          return 0;
        });
      }
    }

    // Pagination
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

    return {
      jobs: paginatedJobs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredJobs.length / limit),
        totalItems: filteredJobs.length,
        itemsPerPage: limit,
      },
      filters: (filters || {}) as Record<string, unknown>,
    };
  }
}
