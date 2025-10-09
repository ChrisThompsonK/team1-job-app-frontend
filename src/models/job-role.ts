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
