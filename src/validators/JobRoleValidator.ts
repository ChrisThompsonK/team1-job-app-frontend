import type { JobRoleFormData } from "../models/job-role.js";
import { Band, Capability, JobStatus } from "../models/job-role.js";

/**
 * Validation result interface
 */
interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * JobRoleValidator class provides validation for job role form data
 */
export class JobRoleValidator {
  /**
   * Validates that all required fields are present and not empty
   * @param formData - The form data to validate
   * @returns ValidationResult indicating if validation passed and any errors
   */
  validateRequiredFields(formData: JobRoleFormData): ValidationResult {
    const errors: string[] = [];

    if (!formData.jobRoleName || formData.jobRoleName.trim() === "") {
      errors.push("Job role name is required");
    }

    if (!formData.location || formData.location.trim() === "") {
      errors.push("Location is required");
    }

    if (!formData.capability) {
      errors.push("Capability is required");
    }

    if (!formData.band) {
      errors.push("Band is required");
    }

    if (!formData.status) {
      errors.push("Status is required");
    }

    if (!formData.numberOfOpenPositions) {
      errors.push("Number of open positions is required");
    }

    if (!formData.closingDate || formData.closingDate.trim() === "") {
      errors.push("Closing date is required");
    }

    if (!formData.description || formData.description.trim() === "") {
      errors.push("Description is required");
    }

    if (!formData.responsibilities) {
      errors.push("Responsibilities are required");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates that capability is a valid enum value
   * @param capability - The capability to validate
   * @returns ValidationResult
   */
  validateCapability(capability: string): ValidationResult {
    const validCapabilities = Object.values(Capability);
    const isValid = validCapabilities.includes(capability as Capability);

    return {
      isValid,
      errors: isValid
        ? []
        : [
          `Invalid capability. Must be one of: ${validCapabilities.join(", ")}`,
        ],
    };
  }

  /**
   * Validates that band is a valid enum value
   * @param band - The band to validate
   * @returns ValidationResult
   */
  validateBand(band: string): ValidationResult {
    const validBands = Object.values(Band);
    const isValid = validBands.includes(band as Band);

    return {
      isValid,
      errors: isValid
        ? []
        : [`Invalid band. Must be one of: ${validBands.join(", ")}`],
    };
  }

  /**
   * Validates that status is a valid enum value
   * @param status - The status to validate
   * @returns ValidationResult
   */
  validateStatus(status: string): ValidationResult {
    const validStatuses = Object.values(JobStatus);
    // Check case-insensitively since the API accepts lowercase
    const normalizedStatus = status.toLowerCase();
    const isValid = validStatuses.some(
      (validStatus) => validStatus.toLowerCase() === normalizedStatus
    );

    return {
      isValid,
      errors: isValid
        ? []
        : [`Invalid status. Must be one of: ${validStatuses.join(", ")}`],
    };
  }

  /**
   * Validates number of open positions
   * @param numberOfOpenPositions - The number to validate
   * @returns ValidationResult
   */
  validateNumberOfOpenPositions(
    numberOfOpenPositions: number | string
  ): ValidationResult {
    const errors: string[] = [];
    let numValue: number;

    if (typeof numberOfOpenPositions === "string") {
      numValue = parseInt(numberOfOpenPositions, 10);
      if (Number.isNaN(numValue)) {
        errors.push("Number of open positions must be a valid number");
        return { isValid: false, errors };
      }
    } else {
      numValue = numberOfOpenPositions;
    }

    if (numValue < 1) {
      errors.push("Number of open positions must be at least 1");
    }

    if (numValue > 1000) {
      errors.push("Number of open positions cannot exceed 1000");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates the closing date format and ensures it's not in the past
   * @param closingDate - The date string to validate
   * @returns ValidationResult
   */
  validateClosingDate(closingDate: string): ValidationResult {
    const errors: string[] = [];

    if (!closingDate || closingDate.trim() === "") {
      errors.push("Closing date is required");
      return { isValid: false, errors };
    }

    const date = new Date(closingDate);
    if (Number.isNaN(date.getTime())) {
      errors.push("Closing date must be a valid date");
      return { isValid: false, errors };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison

    if (date < today) {
      errors.push("Closing date cannot be in the past");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates job spec link format (optional field)
   * @param jobSpecLink - The URL to validate
   * @returns ValidationResult
   */
  validateJobSpecLink(jobSpecLink?: string): ValidationResult {
    const errors: string[] = [];

    // Job spec link is optional, so if it's empty, it's valid
    if (!jobSpecLink || jobSpecLink.trim() === "") {
      return { isValid: true, errors: [] };
    }

    try {
      const url = new URL(jobSpecLink);
      if (!url.protocol.startsWith("http")) {
        errors.push("Job spec link must be a valid HTTP or HTTPS URL");
      }
    } catch {
      errors.push("Job spec link must be a valid URL");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Performs comprehensive validation of job role form data
   * @param formData - The form data to validate
   * @returns ValidationResult with all validation errors
   */
  validateJobRoleFormData(formData: JobRoleFormData): ValidationResult {
    const allErrors: string[] = [];

    // Required fields validation
    const requiredFieldsResult = this.validateRequiredFields(formData);
    allErrors.push(...requiredFieldsResult.errors);

    // Only validate other fields if required fields are present
    if (requiredFieldsResult.isValid) {
      // Capability validation
      if (typeof formData.capability === "string") {
        const capabilityResult = this.validateCapability(formData.capability);
        allErrors.push(...capabilityResult.errors);
      }

      // Band validation
      if (typeof formData.band === "string") {
        const bandResult = this.validateBand(formData.band);
        allErrors.push(...bandResult.errors);
      }

      // Status validation
      if (typeof formData.status === "string") {
        const statusResult = this.validateStatus(formData.status);
        allErrors.push(...statusResult.errors);
      }

      // Number of open positions validation
      const positionsResult = this.validateNumberOfOpenPositions(
        formData.numberOfOpenPositions
      );
      allErrors.push(...positionsResult.errors);

      // Closing date validation
      const closingDateResult = this.validateClosingDate(formData.closingDate);
      allErrors.push(...closingDateResult.errors);

      // Job spec link validation (optional)
      const jobSpecLinkResult = this.validateJobSpecLink(formData.jobSpecLink);
      allErrors.push(...jobSpecLinkResult.errors);
    }

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
    };
  }
}
