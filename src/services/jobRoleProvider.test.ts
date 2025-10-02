import { describe, expect, it } from "vitest";
import { Band, Capability, JobStatus } from "../models/job-role.js";
import { ProvideJobRoles } from "./jobRoleProvider.js";

describe("ProvideJobRoles", () => {
  describe("data provider function", () => {
    it("should return an array of job roles", () => {
      const result = ProvideJobRoles();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it("should return job roles with all required properties", () => {
      const result = ProvideJobRoles();

      result.forEach((jobRole) => {
        expect(jobRole).toHaveProperty("name");
        expect(jobRole).toHaveProperty("location");
        expect(jobRole).toHaveProperty("capability");
        expect(jobRole).toHaveProperty("band");
        expect(jobRole).toHaveProperty("closingDate");
        expect(jobRole).toHaveProperty("numberOfOpenPositions");
        expect(jobRole).toHaveProperty("status");
        expect(jobRole).toHaveProperty("description");
        expect(jobRole).toHaveProperty("responsibilities");

        expect(typeof jobRole.name).toBe("string");
        expect(typeof jobRole.location).toBe("string");
        expect(Object.values(Capability)).toContain(jobRole.capability);
        expect(Object.values(Band)).toContain(jobRole.band);
        expect(jobRole.closingDate).toBeInstanceOf(Date);
        expect(typeof jobRole.numberOfOpenPositions).toBe("number");
        expect(Object.values(JobStatus)).toContain(jobRole.status);
        expect(typeof jobRole.description).toBe("string");
        expect(Array.isArray(jobRole.responsibilities)).toBe(true);
      });
    });

    it("should return consistent data on multiple calls", () => {
      const result1 = ProvideJobRoles();
      const result2 = ProvideJobRoles();

      expect(result1).toEqual(result2);
      expect(result1.length).toBe(result2.length);
    });

    it("should include expected job roles", () => {
      const result = ProvideJobRoles();

      // Check for specific job roles to ensure data integrity
      const jobNames = result.map((job) => job.name);
      expect(jobNames).toContain("Software Engineer");
      expect(jobNames).toContain("Data Scientist");
      expect(jobNames).toContain("Product Manager");
    });

    it("should have valid capability values", () => {
      const result = ProvideJobRoles();

      result.forEach((jobRole) => {
        expect([
          Capability.Data,
          Capability.Workday,
          Capability.Engineering,
        ]).toContain(jobRole.capability);
      });
    });

    it("should have valid band values", () => {
      const result = ProvideJobRoles();

      result.forEach((jobRole) => {
        expect([Band.E1, Band.E2, Band.E3, Band.E4, Band.E5]).toContain(
          jobRole.band
        );
      });
    });

    it("should have valid job status values", () => {
      const result = ProvideJobRoles();

      result.forEach((jobRole) => {
        expect([JobStatus.Open, JobStatus.Closed]).toContain(jobRole.status);
      });
    });

    it("should have valid date objects for closing dates", () => {
      const result = ProvideJobRoles();

      result.forEach((jobRole) => {
        expect(jobRole.closingDate).toBeInstanceOf(Date);
        expect(jobRole.closingDate.toString()).not.toBe("Invalid Date");

        // Ensure closing date is in the future relative to when tests were written
        const testDate = new Date("2024-01-01");
        expect(jobRole.closingDate.getTime()).toBeGreaterThan(
          testDate.getTime()
        );
      });
    });

    it("should have non-empty string values for required fields", () => {
      const result = ProvideJobRoles();

      result.forEach((jobRole) => {
        expect(jobRole.name.trim()).not.toBe("");
        expect(jobRole.location.trim()).not.toBe("");
        expect(jobRole.description.trim()).not.toBe("");
      });
    });

    it("should have valid number of open positions", () => {
      const result = ProvideJobRoles();

      result.forEach((jobRole) => {
        expect(jobRole.numberOfOpenPositions).toBeGreaterThanOrEqual(0);
        expect(Number.isInteger(jobRole.numberOfOpenPositions)).toBe(true);
      });
    });

    it("should have responsibilities as a non-empty array", () => {
      const result = ProvideJobRoles();

      result.forEach((jobRole) => {
        expect(Array.isArray(jobRole.responsibilities)).toBe(true);
        expect(jobRole.responsibilities.length).toBeGreaterThan(0);

        jobRole.responsibilities.forEach((responsibility) => {
          expect(typeof responsibility).toBe("string");
          expect(responsibility.trim()).not.toBe("");
        });
      });
    });

    it("should return at least 3 job roles for testing purposes", () => {
      const result = ProvideJobRoles();

      expect(result.length).toBeGreaterThanOrEqual(3);
    });

    it("should have consistent data structure across all job roles", () => {
      const result = ProvideJobRoles();

      if (result.length > 1) {
        const firstRole = result[0];
        const propertyKeys = Object.keys(firstRole);

        result.forEach((jobRole) => {
          expect(Object.keys(jobRole).sort()).toEqual(propertyKeys.sort());
        });
      }
    });
  });
});
