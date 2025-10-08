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
    const lowerStatus = status.toLowerCase();
    if (lowerStatus === "open") return JobStatus.Open;
    if (lowerStatus === "closed") return JobStatus.Closed;
    if (lowerStatus === "draft") return JobStatus.Open; // Map draft to Open for frontend
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
        console.error("Invalid job data: not an object", job);
        return null;
      }

      const jobData = job as Partial<JobRole> & { jobRoleName?: string };

      // Create the mapped job
      const mappedJob: JobRole = {
        id: jobData.id ?? 0,
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
    } catch (error) {
      console.error("Error mapping job data:", error, "Job data:", job);
      return null;
    }
  }

  /**
   * Map an array of jobs, filtering out any that fail to map
   * Returns an object with the successfully mapped jobs and a count of failures
   */
  mapJobs(
    jobs: unknown[]
  ): { mappedJobs: JobRole[]; failedCount: number } {
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
