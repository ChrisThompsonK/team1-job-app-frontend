export enum Capability {
  Data = "Data",
  Workday = "Workday",
  Engineering = "Engineering",
}

export interface JobRole {
  name: string;
  location: string;
  capability: Capability;
  band: string;
  closingDate: Date;
}
