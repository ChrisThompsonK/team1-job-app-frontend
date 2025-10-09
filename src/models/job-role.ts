export enum Capability {
  Data = "Data & Analytics",
  Workday = "Workday",
  Engineering = "Engineering",
  Product = "Product",
  Design = "Design",
  Platform = "Platform",
  Quality = "Quality",
  Architecture = "Architecture",
  BusinessAnalysis = "Business Analysis",
  Security = "Security",
}

export enum Band {
  E1 = "E1",
  E2 = "E2",
  E3 = "E3",
  E4 = "E4",
  E5 = "E5",
}

export enum JobStatus {
  Open = "Open",
  Closed = "Closed",
}

export interface JobRole {
  id: number;
  name: string;
  location: string;
  capability: Capability;
  band: Band;
  closingDate: Date;
  numberOfOpenPositions: number;
  status: JobStatus;
  description: string;
  responsibilities: string[];
  jobSpecLink?: string; // Optional job specification link
}

// Interface for job role form data/request body
export interface JobRoleFormData {
  jobRoleName: string;
  location: string;
  capability: Capability | string;
  band: Band | string;
  status: JobStatus | string;
  numberOfOpenPositions: number | string;
  closingDate: string; // Date as string from form input
  jobSpecLink?: string; // Optional job specification link
  description: string;
  responsibilities: string | string[]; // Can be string or array depending on form processing
}

// Interface for creating/updating job roles (excludes id)
export interface CreateJobRoleData {
  name: string;
  location: string;
  capability: Capability;
  band: Band;
  status: JobStatus;
  numberOfOpenPositions: number;
  closingDate: Date;
  jobSpecLink?: string;
  description: string;
  responsibilities: string[];
}

// Utility class for job role operations
export class JobRoleFormProcessor {
  /**
   * Validates and transforms form data into proper types
   * @param formData - Raw form data from request body
   * @returns Transformed data with proper types
   */
  static processFormData(formData: JobRoleFormData): CreateJobRoleData {
    const processedData: CreateJobRoleData = {
      name: formData.jobRoleName,
      location: formData.location,
      capability: formData.capability as Capability,
      band: formData.band as Band,
      status: formData.status as JobStatus,
      numberOfOpenPositions:
        typeof formData.numberOfOpenPositions === "string"
          ? parseInt(formData.numberOfOpenPositions, 10)
          : formData.numberOfOpenPositions,
      closingDate: new Date(formData.closingDate),
      description: formData.description,
      responsibilities: Array.isArray(formData.responsibilities)
        ? formData.responsibilities
        : [formData.responsibilities],
    };

    // Only add jobSpecLink if it exists and is not empty
    if (formData.jobSpecLink?.trim()) {
      processedData.jobSpecLink = formData.jobSpecLink;
    }

    return processedData;
  }

  /**
   * Validates that form data contains all required fields
   * @param formData - Form data to validate
   * @returns Validation result with details
   */
  static validateFormData(formData: Partial<JobRoleFormData>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!formData.jobRoleName?.trim()) {
      errors.push("Job role name is required");
    }
    if (!formData.location?.trim()) {
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
    if (
      !formData.numberOfOpenPositions ||
      parseInt(formData.numberOfOpenPositions.toString(), 10) < 1
    ) {
      errors.push("Number of open positions must be a positive number");
    }
    if (!formData.closingDate) {
      errors.push("Closing date is required");
    }
    if (!formData.description?.trim()) {
      errors.push("Description is required");
    }
    if (
      !formData.responsibilities ||
      (Array.isArray(formData.responsibilities) &&
        formData.responsibilities.length === 0)
    ) {
      errors.push("Responsibilities are required");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
