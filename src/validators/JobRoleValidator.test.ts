import { beforeEach, describe, expect, it } from "vitest";
import { Band, Capability, JobStatus } from "../models/job-role.js";
import { JobRoleValidator } from "./JobRoleValidator.js";

describe("JobRoleValidator", () => {
  let validator: JobRoleValidator;

  beforeEach(() => {
    validator = new JobRoleValidator();
  });

  describe("validateRequiredFields", () => {
    it("should return valid result for complete form data", () => {
      const formData = {
        jobRoleName: "Software Engineer",
        location: "Belfast",
        capability: Capability.Engineering,
        band: Band.Junior,
        status: JobStatus.Open,
        numberOfOpenPositions: 5,
        closingDate: "2024-12-31",
        description: "A great job opportunity",
        responsibilities: "Develop software",
        jobSpecLink: "https://example.com/job-spec",
      };

      const result = validator.validateRequiredFields(formData);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should return invalid result for missing required fields", () => {
      const formData = {
        jobRoleName: "",
        location: "",
        capability: "",
        band: "",
        status: "",
        numberOfOpenPositions: 0,
        closingDate: "",
        description: "",
        responsibilities: "",
      };

      const result = validator.validateRequiredFields(formData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Job role name is required");
      expect(result.errors).toContain("Location is required");
      expect(result.errors).toContain("Capability is required");
      expect(result.errors).toContain("Band is required");
      expect(result.errors).toContain("Status is required");
      expect(result.errors).toContain("Number of open positions is required");
      expect(result.errors).toContain("Closing date is required");
      expect(result.errors).toContain("Description is required");
      expect(result.errors).toContain("Responsibilities are required");
    });
  });

  describe("validateCapability", () => {
    it("should return valid result for valid capability", () => {
      const result = validator.validateCapability(Capability.Engineering);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should return invalid result for invalid capability", () => {
      const result = validator.validateCapability("InvalidCapability");

      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain("Invalid capability. Must be one of:");
    });
  });

  describe("validateBand", () => {
    it("should return valid result for valid band", () => {
      const result = validator.validateBand(Band.Junior);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should return invalid result for invalid band", () => {
      const result = validator.validateBand("InvalidBand");

      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain("Invalid band. Must be one of:");
    });
  });

  describe("validateStatus", () => {
    it("should return valid result for valid status", () => {
      const result = validator.validateStatus(JobStatus.Open);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should return invalid result for invalid status", () => {
      const result = validator.validateStatus("InvalidStatus");

      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain("Invalid status. Must be one of:");
    });
  });

  describe("validateNumberOfOpenPositions", () => {
    it("should return valid result for valid number", () => {
      const result = validator.validateNumberOfOpenPositions(5);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should return invalid result for number less than 1", () => {
      const result = validator.validateNumberOfOpenPositions(0);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Number of open positions must be at least 1"
      );
    });

    it("should return invalid result for number greater than 1000", () => {
      const result = validator.validateNumberOfOpenPositions(1001);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Number of open positions cannot exceed 1000"
      );
    });

    it("should handle string input", () => {
      const result = validator.validateNumberOfOpenPositions("5");

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should return invalid result for invalid string input", () => {
      const result = validator.validateNumberOfOpenPositions("invalid");

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Number of open positions must be a valid number"
      );
    });
  });

  describe("validateClosingDate", () => {
    it("should return valid result for future date", () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const result = validator.validateClosingDate(
        futureDate.toISOString().split("T")[0]
      );

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should return invalid result for past date", () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      const result = validator.validateClosingDate(
        pastDate.toISOString().split("T")[0]
      );

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Closing date cannot be in the past");
    });

    it("should return invalid result for invalid date format", () => {
      const result = validator.validateClosingDate("invalid-date");

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Closing date must be a valid date");
    });
  });

  describe("validateJobSpecLink", () => {
    it("should return valid result for valid URL", () => {
      const result = validator.validateJobSpecLink(
        "https://example.com/job-spec"
      );

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should return valid result for empty URL (optional field)", () => {
      const result = validator.validateJobSpecLink("");

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should return invalid result for invalid URL", () => {
      const result = validator.validateJobSpecLink("not-a-url");

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Job spec link must be a valid URL");
    });

    it("should return invalid result for non-HTTP URL", () => {
      const result = validator.validateJobSpecLink("ftp://example.com");

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Job spec link must be a valid HTTP or HTTPS URL"
      );
    });
  });

  describe("validateJobRoleFormData", () => {
    it("should return valid result for complete and valid form data", () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);

      const formData = {
        jobRoleName: "Software Engineer",
        location: "Belfast",
        capability: Capability.Engineering,
        band: Band.Junior,
        status: JobStatus.Open,
        numberOfOpenPositions: 5,
        closingDate: futureDate.toISOString().split("T")[0],
        description: "A great job opportunity",
        responsibilities: "Develop software",
        jobSpecLink: "https://example.com/job-spec",
      };

      const result = validator.validateJobRoleFormData(formData);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should return invalid result with accumulated errors", () => {
      const formData = {
        jobRoleName: "",
        location: "",
        capability: "InvalidCapability",
        band: "InvalidBand",
        status: "InvalidStatus",
        numberOfOpenPositions: 0,
        closingDate: "invalid-date",
        description: "",
        responsibilities: "",
        jobSpecLink: "not-a-url",
      };

      const result = validator.validateJobRoleFormData(formData);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors).toContain("Job role name is required");
      expect(result.errors).toContain("Location is required");
    });
  });
});
