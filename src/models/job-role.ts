export enum Capability {
  Data = "Data",
  Workday = "Workday",
  Engineering = "Engineering",
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
  name: string;
  location: string;
  capability: Capability;
  band: Band;
  closingDate: Date;
  numberOfOpenPositions: number;
  status: JobStatus;
  description: string;
  responsibilities: string[];
}
