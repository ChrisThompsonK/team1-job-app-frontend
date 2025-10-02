import { describe, expect, it } from "vitest";
import { Band, Capability, JobStatus } from "../models/job-role.js";
import { sanitizeJobRoleData, validateJobRoleData } from "./validation.js";

describe("Validation Utils", () => {
  describe("validateJobRoleData", () => {
    const validJobData = {
      name: "Software Engineer",
      location: "London",
      capability: Capability.Engineering,
      band: Band.E3,
      closingDate: new Date("2025-12-31"),
      numberOfOpenPositions: 2,
      status: JobStatus.Open,
      description: "A software engineering role",
      responsibilities: ["Code", "Review", "Test"],
    };

    it("should validate correct job role data", () => {
      const result = validateJobRoleData(validJobData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    describe("name validation", () => {
      it("should require name", () => {
        const data = { ...validJobData, name: undefined };
        const result = validateJobRoleData(data);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContainEqual({
          field: "name",
          message: "Name is required and must be a non-empty string",
        });
      });

      it("should reject empty name", () => {
        const data = { ...validJobData, name: "" };
        const result = validateJobRoleData(data);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContainEqual({
          field: "name",
          message: "Name is required and must be a non-empty string",
        });
      });

      it("should reject non-string name", () => {
        const data = { ...validJobData, name: 123 };
        const result = validateJobRoleData(data);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContainEqual({
          field: "name",
          message: "Name is required and must be a non-empty string",
        });
      });
    });

    describe("location validation", () => {
      it("should require location", () => {
        const data = { ...validJobData, location: undefined };
        const result = validateJobRoleData(data);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContainEqual({
          field: "location",
          message: "Location is required and must be a non-empty string",
        });
      });

      it("should reject empty location", () => {
        const data = { ...validJobData, location: "   " };
        const result = validateJobRoleData(data);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContainEqual({
          field: "location",
          message: "Location is required and must be a non-empty string",
        });
      });
    });

    describe("capability validation", () => {
      it("should require capability", () => {
        const data = { ...validJobData, capability: undefined };
        const result = validateJobRoleData(data);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContainEqual({
          field: "capability",
          message: "Capability is required and must be a string",
        });
      });

      it("should reject invalid capability", () => {
        const data = { ...validJobData, capability: "InvalidCapability" };
        const result = validateJobRoleData(data);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContainEqual({
          field: "capability",
          message: "Capability must be one of: Data, Workday, Engineering",
        });
      });

      it("should accept valid capabilities", () => {
        for (const capability of Object.values(Capability)) {
          const data = { ...validJobData, capability };
          const result = validateJobRoleData(data);
          const capabilityErrors = result.errors.filter(
            (e) => e.field === "capability"
          );
          expect(capabilityErrors).toHaveLength(0);
        }
      });
    });

    describe("band validation", () => {
      it("should require band", () => {
        const data = { ...validJobData, band: undefined };
        const result = validateJobRoleData(data);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContainEqual({
          field: "band",
          message: "Band is required and must be a string",
        });
      });

      it("should reject invalid band", () => {
        const data = { ...validJobData, band: "E10" };
        const result = validateJobRoleData(data);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContainEqual({
          field: "band",
          message: "Band must be one of: E1, E2, E3, E4, E5",
        });
      });

      it("should accept valid bands", () => {
        for (const band of Object.values(Band)) {
          const data = { ...validJobData, band };
          const result = validateJobRoleData(data);
          const bandErrors = result.errors.filter((e) => e.field === "band");
          expect(bandErrors).toHaveLength(0);
        }
      });
    });

    describe("closingDate validation", () => {
      it("should require closing date", () => {
        const data = { ...validJobData, closingDate: undefined };
        const result = validateJobRoleData(data);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContainEqual({
          field: "closingDate",
          message: "Closing date is required",
        });
      });

      it("should reject invalid date", () => {
        const data = { ...validJobData, closingDate: "invalid-date" };
        const result = validateJobRoleData(data);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContainEqual({
          field: "closingDate",
          message: "Closing date must be a valid date",
        });
      });

      it("should reject past dates", () => {
        const data = { ...validJobData, closingDate: new Date("2020-01-01") };
        const result = validateJobRoleData(data);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContainEqual({
          field: "closingDate",
          message: "Closing date must be in the future",
        });
      });
    });

    describe("numberOfOpenPositions validation", () => {
      it("should require numberOfOpenPositions", () => {
        const data = { ...validJobData, numberOfOpenPositions: undefined };
        const result = validateJobRoleData(data);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContainEqual({
          field: "numberOfOpenPositions",
          message: "Number of open positions is required",
        });
      });

      it("should reject non-integer values", () => {
        const data = { ...validJobData, numberOfOpenPositions: 1.5 };
        const result = validateJobRoleData(data);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContainEqual({
          field: "numberOfOpenPositions",
          message: "Number of open positions must be a positive integer",
        });
      });

      it("should reject zero or negative values", () => {
        const data = { ...validJobData, numberOfOpenPositions: 0 };
        const result = validateJobRoleData(data);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContainEqual({
          field: "numberOfOpenPositions",
          message: "Number of open positions must be a positive integer",
        });
      });
    });

    describe("status validation", () => {
      it("should require status", () => {
        const data = { ...validJobData, status: undefined };
        const result = validateJobRoleData(data);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContainEqual({
          field: "status",
          message: "Status is required and must be a string",
        });
      });

      it("should reject invalid status", () => {
        const data = { ...validJobData, status: "InvalidStatus" };
        const result = validateJobRoleData(data);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContainEqual({
          field: "status",
          message: "Status must be one of: Open, Closed",
        });
      });
    });

    describe("description validation", () => {
      it("should require description", () => {
        const data = { ...validJobData, description: undefined };
        const result = validateJobRoleData(data);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContainEqual({
          field: "description",
          message: "Description is required and must be a non-empty string",
        });
      });

      it("should reject empty description", () => {
        const data = { ...validJobData, description: "   " };
        const result = validateJobRoleData(data);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContainEqual({
          field: "description",
          message: "Description is required and must be a non-empty string",
        });
      });
    });

    describe("responsibilities validation", () => {
      it("should require responsibilities", () => {
        const data = { ...validJobData, responsibilities: undefined };
        const result = validateJobRoleData(data);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContainEqual({
          field: "responsibilities",
          message: "Responsibilities are required",
        });
      });

      it("should reject non-array responsibilities", () => {
        const data = { ...validJobData, responsibilities: "not an array" };
        const result = validateJobRoleData(data);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContainEqual({
          field: "responsibilities",
          message: "Responsibilities must be an array",
        });
      });

      it("should reject empty responsibilities array", () => {
        const data = { ...validJobData, responsibilities: [] };
        const result = validateJobRoleData(data);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContainEqual({
          field: "responsibilities",
          message: "At least one responsibility is required",
        });
      });

      it("should reject non-string responsibilities", () => {
        const data = { ...validJobData, responsibilities: ["valid", 123, ""] };
        const result = validateJobRoleData(data);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContainEqual({
          field: "responsibilities[1]",
          message: "Each responsibility must be a non-empty string",
        });
        expect(result.errors).toContainEqual({
          field: "responsibilities[2]",
          message: "Each responsibility must be a non-empty string",
        });
      });
    });
  });

  describe("sanitizeJobRoleData", () => {
    it("should sanitize and convert valid data", () => {
      const input = {
        name: "  Software Engineer  ",
        location: "  London  ",
        capability: Capability.Engineering,
        band: Band.E3,
        closingDate: "2025-12-31",
        numberOfOpenPositions: "2",
        status: JobStatus.Open,
        description: "  A great role  ",
        responsibilities: ["  Task 1  ", "  Task 2  ", ""],
      };

      const result = sanitizeJobRoleData(input);

      expect(result).toEqual({
        name: "Software Engineer",
        location: "London",
        capability: Capability.Engineering,
        band: Band.E3,
        closingDate: new Date("2025-12-31"),
        numberOfOpenPositions: 2,
        status: JobStatus.Open,
        description: "A great role",
        responsibilities: ["Task 1", "Task 2"],
      });
    });

    it("should handle missing or invalid data gracefully", () => {
      const input = {
        name: undefined,
        location: null,
        capability: Capability.Data,
        band: Band.E1,
        closingDate: "2025-01-01",
        numberOfOpenPositions: "invalid",
        status: JobStatus.Open,
        description: undefined,
        responsibilities: null,
      };

      const result = sanitizeJobRoleData(input);

      expect(result).toEqual({
        name: "",
        location: "",
        capability: Capability.Data,
        band: Band.E1,
        closingDate: new Date("2025-01-01"),
        numberOfOpenPositions: 1,
        status: JobStatus.Open,
        description: "",
        responsibilities: [],
      });
    });
  });
});
