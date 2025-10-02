import {
  Band,
  Capability,
  type JobRole,
  JobStatus,
} from "../models/job-role.js";

export function ProvideJobRoles(): JobRole[] {
  return [
    {
      name: "Software Engineer",
      location: "Bangalore",
      capability: Capability.Data,
      band: Band.E3,
      closingDate: new Date("2024-12-31"),
      numberOfOpenPositions: 3,
      status: JobStatus.Open,
      description:
        "Join our dynamic engineering team to develop cutting-edge data solutions. You will work on scalable systems that process large volumes of data and create innovative analytics platforms.",
      responsibilities: [
        "Design and develop scalable data processing systems",
        "Collaborate with cross-functional teams to deliver high-quality software",
        "Write clean, maintainable, and efficient code",
        "Participate in code reviews and technical discussions",
        "Troubleshoot and debug applications",
      ],
    },
    {
      name: "Data Scientist",
      location: "Hyderabad",
      capability: Capability.Workday,
      band: Band.E4,
      closingDate: new Date("2024-11-30"),
      numberOfOpenPositions: 2,
      status: JobStatus.Open,
      description:
        "Lead data science initiatives to extract insights from complex datasets. Drive business decisions through advanced analytics and machine learning models.",
      responsibilities: [
        "Develop and implement machine learning models",
        "Analyze large datasets to identify trends and patterns",
        "Create data visualizations and reports for stakeholders",
        "Collaborate with business teams to understand requirements",
        "Mentor junior data scientists and analysts",
      ],
    },
    {
      name: "Product Manager",
      location: "Pune",
      capability: Capability.Engineering,
      band: Band.E5,
      closingDate: new Date("2024-10-31"),
      numberOfOpenPositions: 1,
      status: JobStatus.Closed,
      description:
        "Drive product strategy and execution for our engineering tools and platforms. Work closely with engineering teams to deliver products that enhance developer productivity.",
      responsibilities: [
        "Define product roadmap and strategy",
        "Gather and prioritize product requirements",
        "Work with engineering teams to deliver features",
        "Analyze user feedback and market trends",
        "Present product updates to leadership and stakeholders",
      ],
    },
  ];
}
