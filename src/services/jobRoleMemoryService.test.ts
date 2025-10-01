import { beforeEach, describe, expect, it } from "vitest";
import { Capability, type JobRole } from "../models/job-role.js";
import { JobRoleMemoryService } from "./jobRoleMemoryService.js";

describe("JobRoleMemoryService", () => {
  let service: JobRoleMemoryService;
  let mockJobRoles: JobRole[];

  beforeEach(() => {
    mockJobRoles = [
      {
        name: "Software Engineer",
        location: "London",
        capability: Capability.Engineering,
        band: "E3",
        closingDate: new Date("2024-12-31"),
      },
      {
        name: "Data Scientist",
        location: "Manchester",
        capability: Capability.Data,
        band: "E4",
        closingDate: new Date("2024-11-30"),
      },
    ];
    service = new JobRoleMemoryService(mockJobRoles);
  });

  describe("constructor", () => {
    it("should initialize with provided job roles", () => {
      const result = service.getAllJobs();
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("Software Engineer");
      expect(result[1].name).toBe("Data Scientist");
    });

    it("should create a copy of the initial job roles array", () => {
      const result = service.getAllJobs();
      expect(result).not.toBe(mockJobRoles);
      expect(result).toEqual(mockJobRoles);
    });

    it("should handle empty job roles array", () => {
      const emptyService = new JobRoleMemoryService([]);
      const result = emptyService.getAllJobs();
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });
  });

  describe("getAllJobs", () => {
    it("should return all job roles", () => {
      const result = service.getAllJobs();
      expect(result).toHaveLength(2);
      expect(result).toEqual(mockJobRoles);
    });

    it("should return job roles with correct properties", () => {
      const result = service.getAllJobs();
      const firstJob = result[0];

      expect(firstJob).toHaveProperty("name");
      expect(firstJob).toHaveProperty("location");
      expect(firstJob).toHaveProperty("capability");
      expect(firstJob).toHaveProperty("band");
      expect(firstJob).toHaveProperty("closingDate");

      expect(firstJob.name).toBe("Software Engineer");
      expect(firstJob.location).toBe("London");
      expect(firstJob.capability).toBe(Capability.Engineering);
      expect(firstJob.band).toBe("E3");
      expect(firstJob.closingDate).toBeInstanceOf(Date);
    });

    it("should return the same array on multiple calls", () => {
      const result1 = service.getAllJobs();
      const result2 = service.getAllJobs();
      expect(result1).toEqual(result2);
    });
  });
});
