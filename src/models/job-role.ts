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
  Junior = "Junior",
  Mid = "Mid",
  Senior = "Senior",
  Principal = "Principal",
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
  jobRoleName: string;
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

// Utility functions for job role form processing

/**
 * Validates and transforms form data into proper types
 * @param formData - Raw form data from request body
 * @returns Transformed data with proper types
 */
export function processFormData(formData: JobRoleFormData): CreateJobRoleData {
  const processedData: CreateJobRoleData = {
    jobRoleName: formData.jobRoleName,
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
      : formData.responsibilities
          .split(",")
          .map((r) => r.trim())
          .filter((r) => r.length > 0),
  };

  // Only add jobSpecLink if it exists and is not empty
  if (formData.jobSpecLink?.trim()) {
    processedData.jobSpecLink = formData.jobSpecLink;
  }

  return processedData;
}
