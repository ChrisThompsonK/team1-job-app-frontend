import { Capability, type JobRole } from "../models/job-role.js";
export function ProvideJobRoles(): JobRole[] {
  return [
    {
      name: "Software Engineer",
      location: "Bangalore",
      capability: Capability.Data,
      band: "E3",
      closingDate: new Date("2024-12-31"),
    },
    {
      name: "Data Scientist",
      location: "Hyderabad",
      capability: Capability.Workday,
      band: "E4",
      closingDate: new Date("2024-11-30"),
    },
    {
      name: "Product Manager",
      location: "Pune",
      capability: Capability.Engineering,
      band: "E5",
      closingDate: new Date("2024-10-31"),
    },
  ];
}
