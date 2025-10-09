import type { JobRole } from "../models/job-role.js";
import { JobStatus } from "../models/job-role.js";

/**
 * Maps job data from the backend API to the frontend JobRole model.
 * Handles data validation, normalization, and transformation.
 */
export class JobRoleMapper {
  /**
   * Normalize status values between backend and frontend
   */
  private normalizeStatus(status: string): JobStatus {
    if (!status) return JobStatus.Open;
    const lowerStatus = status.toLowerCase().trim();
    if (lowerStatus === "open") return JobStatus.Open;
    if (lowerStatus === "closed") return JobStatus.Closed;
    return JobStatus.Open; // Default fallback
  }

  /**
   * Parse a date value, handling both string and Date inputs
   */
  private parseDate(dateValue: unknown): Date {
    if (dateValue instanceof Date) {
      return dateValue;
    }
    if (typeof dateValue === "string") {
      const parsed = new Date(dateValue);
      // Check if date is valid
      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    return new Date(); // Default to current date if invalid
  }

  /**
   * Map a single job from backend format to frontend JobRole
   * Returns null if the job data is invalid or cannot be mapped
   */
  mapJob(job: unknown): JobRole | null {
    try {
      // Validate that job is an object (but not an array or null)
      if (!job || typeof job !== "object" || Array.isArray(job)) {
        return null;
      }

      const jobData = job as Partial<JobRole> & { jobRoleName?: string };

      // Extract and validate ID - handle both string and number IDs
      let jobId: number;

      if (jobData.id === undefined || jobData.id === null) {
        return null;
      }

      // Convert string IDs to numbers
      if (typeof jobData.id === "string") {
        jobId = parseInt(jobData.id, 10);
        if (Number.isNaN(jobId)) {
          return null;
        }
      } else if (typeof jobData.id === "number") {
        jobId = jobData.id;
        if (Number.isNaN(jobId)) {
          return null;
        }
      } else {
        return null;
      }

      // Create the mapped job
      const mappedJob: JobRole = {
        id: jobId,
        name: jobData.name ?? jobData.jobRoleName ?? "Untitled Job",
        status: this.normalizeStatus((jobData.status as string) ?? ""),
        closingDate: this.parseDate(jobData.closingDate),
        numberOfOpenPositions: jobData.numberOfOpenPositions ?? 1,
        description: jobData.description ?? "",
        responsibilities: Array.isArray(jobData.responsibilities)
          ? jobData.responsibilities
          : [],
        location: jobData.location ?? "",
        capability: jobData.capability ?? ("" as never),
        band: jobData.band ?? ("" as never),
      };

      return mappedJob;
    } catch (_error) {
      return null;
    }
  }

  /**
   * Map an array of jobs, filtering out any that fail to map
   * Returns an object with the successfully mapped jobs and a count of failures
   */
  mapJobs(jobs: unknown[]): { mappedJobs: JobRole[]; failedCount: number } {
    const mappedJobs = jobs
      .map((job) => this.mapJob(job))
      .filter((job): job is JobRole => job !== null);

    const failedCount = jobs.length - mappedJobs.length;

    if (failedCount > 0) {
      console.warn(
        `Failed to map ${failedCount} out of ${jobs.length} jobs due to invalid data format`
      );
    }

    return { mappedJobs, failedCount };
  }
}
