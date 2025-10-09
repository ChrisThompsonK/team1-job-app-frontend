import { beforeEach, describe, expect, it, vi } from "vitest";
import { JobStatus } from "../models/job-role.js";
import { JobRoleMapper } from "./jobRoleMapper.js";

describe("JobRoleMapper", () => {
  let mapper: JobRoleMapper;

  beforeEach(() => {
    mapper = new JobRoleMapper();
    // Clear console mocks
    vi.clearAllMocks();
  });

  describe("mapJob", () => {
    it("should map a complete valid job object", () => {
      const input = {
        id: 1,
        name: "Software Engineer",
        status: "open",
        closingDate: "2025-12-31",
        numberOfOpenPositions: 3,
        description: "Great opportunity",
        responsibilities: ["Code", "Review", "Test"],
        location: "London",
        capability: "Engineering",
        band: "Senior",
      };

      const result = mapper.mapJob(input);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(1);
      expect(result?.name).toBe("Software Engineer");
      expect(result?.status).toBe(JobStatus.Open);
      expect(result?.closingDate).toBeInstanceOf(Date);
      expect(result?.numberOfOpenPositions).toBe(3);
      expect(result?.description).toBe("Great opportunity");
      expect(result?.responsibilities).toEqual(["Code", "Review", "Test"]);
      expect(result?.location).toBe("London");
      expect(result?.capability).toBe("Engineering");
      expect(result?.band).toBe("Senior");
    });

    it("should handle jobRoleName as alternative to name", () => {
      const input = {
        id: 1,
        jobRoleName: "Data Analyst",
        status: "open",
      };

      const result = mapper.mapJob(input);

      expect(result).not.toBeNull();
      expect(result?.name).toBe("Data Analyst");
    });

    it("should prefer name over jobRoleName when both exist", () => {
      const input = {
        id: 1,
        name: "Software Engineer",
        jobRoleName: "Data Analyst",
        status: "open",
      };

      const result = mapper.mapJob(input);

      expect(result).not.toBeNull();
      expect(result?.name).toBe("Software Engineer");
    });

    it("should use default values for missing fields", () => {
      const input = {
        id: 1,
      };

      const result = mapper.mapJob(input);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(1);
      expect(result?.name).toBe("Untitled Job");
      expect(result?.status).toBe(JobStatus.Open);
      expect(result?.closingDate).toBeInstanceOf(Date);
      expect(result?.numberOfOpenPositions).toBe(1);
      expect(result?.description).toBe("");
      expect(result?.responsibilities).toEqual([]);
      expect(result?.location).toBe("");
    });

    it("should handle null input", () => {
      const result = mapper.mapJob(null);

      expect(result).toBeNull();
    });

    it("should handle undefined input", () => {
      const result = mapper.mapJob(undefined);

      expect(result).toBeNull();
    });

    it("should handle non-object input", () => {
      const result = mapper.mapJob("not an object");

      expect(result).toBeNull();
    });

    it("should handle array input", () => {
      const result = mapper.mapJob([1, 2, 3]);

      expect(result).toBeNull();
    });

    describe("status normalization", () => {
      it("should normalize 'open' status", () => {
        const result = mapper.mapJob({ id: 1, status: "open" });
        expect(result?.status).toBe(JobStatus.Open);
      });

      it("should normalize 'Open' status (case insensitive)", () => {
        const result = mapper.mapJob({ id: 1, status: "Open" });
        expect(result?.status).toBe(JobStatus.Open);
      });

      it("should normalize 'OPEN' status", () => {
        const result = mapper.mapJob({ id: 1, status: "OPEN" });
        expect(result?.status).toBe(JobStatus.Open);
      });

      it("should normalize 'closed' status", () => {
        const result = mapper.mapJob({ id: 1, status: "closed" });
        expect(result?.status).toBe(JobStatus.Closed);
      });

      it("should normalize 'Closed' status (case insensitive)", () => {
        const result = mapper.mapJob({ id: 1, status: "Closed" });
        expect(result?.status).toBe(JobStatus.Closed);
      });

      it("should map 'draft' to Open status", () => {
        const result = mapper.mapJob({ id: 1, status: "draft" });
        expect(result?.status).toBe(JobStatus.Open);
      });

      it("should default to Open for unknown status", () => {
        const result = mapper.mapJob({ id: 1, status: "unknown" });
        expect(result?.status).toBe(JobStatus.Open);
      });

      it("should default to Open for empty status", () => {
        const result = mapper.mapJob({ id: 1, status: "" });
        expect(result?.status).toBe(JobStatus.Open);
      });

      it("should default to Open for missing status", () => {
        const result = mapper.mapJob({ id: 1 });
        expect(result?.status).toBe(JobStatus.Open);
      });
    });

    describe("date parsing", () => {
      it("should parse string dates", () => {
        const result = mapper.mapJob({
          id: 1,
          closingDate: "2025-12-31",
        });

        expect(result?.closingDate).toBeInstanceOf(Date);
        expect(result?.closingDate.getFullYear()).toBe(2025);
        expect(result?.closingDate.getMonth()).toBe(11); // December (0-indexed)
        expect(result?.closingDate.getDate()).toBe(31);
      });

      it("should handle Date objects", () => {
        const testDate = new Date("2025-06-15");
        const result = mapper.mapJob({
          id: 1,
          closingDate: testDate,
        });

        expect(result?.closingDate).toBeInstanceOf(Date);
        expect(result?.closingDate.getTime()).toBe(testDate.getTime());
      });

      it("should default to current date for invalid date strings", () => {
        const beforeTest = Date.now();
        const result = mapper.mapJob({
          id: 1,
          closingDate: "invalid-date",
        });
        const afterTest = Date.now();

        expect(result?.closingDate).toBeInstanceOf(Date);
        expect(result?.closingDate.getTime()).toBeGreaterThanOrEqual(
          beforeTest
        );
        expect(result?.closingDate.getTime()).toBeLessThanOrEqual(afterTest);
      });

      it("should default to current date for missing closingDate", () => {
        const beforeTest = Date.now();
        const result = mapper.mapJob({ id: 1 });
        const afterTest = Date.now();

        expect(result?.closingDate).toBeInstanceOf(Date);
        expect(result?.closingDate.getTime()).toBeGreaterThanOrEqual(
          beforeTest
        );
        expect(result?.closingDate.getTime()).toBeLessThanOrEqual(afterTest);
      });
    });

    describe("responsibilities handling", () => {
      it("should handle valid array of responsibilities", () => {
        const result = mapper.mapJob({
          id: 1,
          responsibilities: ["Task 1", "Task 2"],
        });

        expect(result?.responsibilities).toEqual(["Task 1", "Task 2"]);
      });

      it("should default to empty array for non-array responsibilities", () => {
        const result = mapper.mapJob({
          id: 1,
          responsibilities: "not an array",
        });

        expect(result?.responsibilities).toEqual([]);
      });

      it("should default to empty array for missing responsibilities", () => {
        const result = mapper.mapJob({ id: 1 });

        expect(result?.responsibilities).toEqual([]);
      });

      it("should handle empty array", () => {
        const result = mapper.mapJob({
          id: 1,
          responsibilities: [],
        });

        expect(result?.responsibilities).toEqual([]);
      });
    });
  });

  describe("mapJobs", () => {
    it("should map an array of valid jobs", () => {
      const input = [
        { id: 1, name: "Job 1", status: "open" },
        { id: 2, name: "Job 2", status: "closed" },
        { id: 3, name: "Job 3", status: "open" },
      ];

      const result = mapper.mapJobs(input);

      expect(result.mappedJobs).toHaveLength(3);
      expect(result.failedCount).toBe(0);
      expect(result.mappedJobs[0].name).toBe("Job 1");
      expect(result.mappedJobs[1].name).toBe("Job 2");
      expect(result.mappedJobs[2].name).toBe("Job 3");
    });

    it("should filter out invalid jobs and count failures", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const input = [
        { id: 1, name: "Valid Job", status: "open" },
        null,
        { id: 2, name: "Another Valid", status: "closed" },
        "invalid",
        { id: 3, name: "Third Valid", status: "open" },
      ];

      const result = mapper.mapJobs(input);

      expect(result.mappedJobs).toHaveLength(3);
      expect(result.failedCount).toBe(2);
      expect(result.mappedJobs[0].name).toBe("Valid Job");
      expect(result.mappedJobs[1].name).toBe("Another Valid");
      expect(result.mappedJobs[2].name).toBe("Third Valid");
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to map 2 out of 5 jobs due to invalid data format"
      );

      consoleSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    it("should handle empty array", () => {
      const result = mapper.mapJobs([]);

      expect(result.mappedJobs).toHaveLength(0);
      expect(result.failedCount).toBe(0);
    });

    it("should return empty array when all jobs are invalid", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const input = [null, undefined, "invalid", 123];

      const result = mapper.mapJobs(input);

      expect(result.mappedJobs).toHaveLength(0);
      expect(result.failedCount).toBe(4);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to map 4 out of 4 jobs due to invalid data format"
      );

      consoleSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    it("should not log warning when all jobs map successfully", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const input = [
        { id: 1, name: "Job 1" },
        { id: 2, name: "Job 2" },
      ];

      mapper.mapJobs(input);

      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});
