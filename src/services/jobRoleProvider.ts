import type { JobRole } from "../models/job-role";

export function provideJobRoles(): JobRole[] {
  return [
    {
      name: "Software Engineer",
      location: "Bangalore",
      capability: 5,
      band: "E3",
      closingDate: new Date("2024-12-31"),
    },
    {
      name: "Data Scientist",
      location: "Hyderabad",
      capability: 3,
      band: "E4",
      closingDate: new Date("2024-11-30"),
    },
    {
      name: "Product Manager",
      location: "Pune",
      capability: 2,
      band: "E5",
      closingDate: new Date("2024-10-31"),
    },
  ];
}
