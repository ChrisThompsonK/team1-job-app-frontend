import type { IjobRole } from "../models/job-role";

export function provideJobRoles(): IjobRole[] {
  return [
    {
      name: "Software Engineer",
      location: "Bangalore",
      capacity: 5,
      band: "E3",
      closingDate: new Date("2024-12-31"),
    },
    {
      name: "Data Scientist",
      location: "Hyderabad",
      capacity: 3,
      band: "E4",
      closingDate: new Date("2024-11-30"),
    },
    {
      name: "Product Manager",
      location: "Pune",
      capacity: 2,
      band: "E5",
      closingDate: new Date("2024-10-31"),
    },
  ];
}
