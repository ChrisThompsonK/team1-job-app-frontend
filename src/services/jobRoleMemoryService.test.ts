import { beforeEach, describe, expect, it } from "vitest";
import {
  Band,
  Capability,
  type JobRole,
  JobStatus,
} from "../models/job-role.js";
import { JobRoleMemoryService } from "./jobRoleMemoryService.js";

describe("JobRoleMemoryService", () => {
  let service: JobRoleMemoryService;
  let mockJobRoles: JobRole[];

  beforeEach(() => {
    mockJobRoles = [
      {
        id: 1,
        name: "Software Engineer",
        location: "London",
        capability: Capability.Engineering,
        band: Band.E3,
        closingDate: new Date("2024-12-31"),
        numberOfOpenPositions: 2,
        status: JobStatus.Open,
        description: "Develop and maintain software applications",
        responsibilities: [
          "Write clean, maintainable code",
          "Collaborate with team members",
          "Participate in code reviews",
        ],
      },
      {
        id: 2,
        name: "Data Scientist",
        location: "Manchester",
        capability: Capability.Data,
        band: Band.E4,
        closingDate: new Date("2024-11-30"),
        numberOfOpenPositions: 1,
        status: JobStatus.Open,
        description: "Analyze data and build predictive models",
        responsibilities: [
          "Develop machine learning models",
          "Analyze large datasets",
          "Present findings to stakeholders",
        ],
      },
    ];
    service = new JobRoleMemoryService(mockJobRoles);
  });

  describe("constructor", () => {
    it("should initialize with provided job roles", async () => {
      const result = await service.getAllJobs();
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("Software Engineer");
      expect(result[1].name).toBe("Data Scientist");
    });

    it("should create a copy of the initial job roles array", async () => {
      const result = await service.getAllJobs();
      expect(result).not.toBe(mockJobRoles);
      expect(result).toEqual(mockJobRoles);
    });

    it("should handle empty job roles array", async () => {
      const emptyService = new JobRoleMemoryService([]);
      const result = await emptyService.getAllJobs();
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });
  });

  describe("getAllJobs", () => {
    it("should return all job roles", async () => {
      const result = await service.getAllJobs();
      expect(result).toHaveLength(2);
      expect(result).toEqual(mockJobRoles);
    });

    it("should return job roles with correct properties", async () => {
      const result = await service.getAllJobs();
      const firstJob = result[0];

      expect(firstJob).toHaveProperty("name");
      expect(firstJob).toHaveProperty("location");
      expect(firstJob).toHaveProperty("capability");
      expect(firstJob).toHaveProperty("band");
      expect(firstJob).toHaveProperty("closingDate");

      expect(firstJob.name).toBe("Software Engineer");
      expect(firstJob.location).toBe("London");
      expect(firstJob.capability).toBe(Capability.Engineering);
      expect(firstJob.band).toBe(Band.E3);
      expect(firstJob.closingDate).toBeInstanceOf(Date);
    });

    it("should return the same array on multiple calls", async () => {
      const result1 = await service.getAllJobs();
      const result2 = await service.getAllJobs();
      expect(result1).toEqual(result2);
    });
  });
});
