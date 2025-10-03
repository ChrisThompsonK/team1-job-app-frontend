import path from "node:path";
import type { Request, Response } from "express";
import express from "express";
import nunjucks from "nunjucks";
import { JobRoleController } from "./controllers/jobRoleController.js";
import { JobRoleMemoryService } from "./services/jobRoleMemoryService.js";
import { ProvideJobRoles } from "./services/jobRoleProvider.js";
import { JobRoleAPIController } from "./controllers/JobRoleAPIController.js";
import { JobRoleAPIService } from "./services/JobRoleAPIService.js";

const app = express();
const port = process.env.PORT || 3000;

// Configure Nunjucks
nunjucks.configure(path.join(process.cwd(), "views"), {
  autoescape: true,
  express: app,
});

// Set Nunjucks as the view engine
app.set("view engine", "njk");

// Serve static files from public directory
app.use(express.static(path.join(process.cwd(), "public")));

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize services and controllers with dependency injection
const jobs = ProvideJobRoles();
const jobRoleService = new JobRoleMemoryService(jobs);
const jobRoleController = new JobRoleController(jobRoleService);

const jobRoleAPIService = new JobRoleAPIService();
const jobRoleAPIController = new JobRoleAPIController(jobRoleAPIService);

// Hello World endpoint
app.get("/", (_req: Request, res: Response) => {
  res.render("index", {
    title: "Job Application Frontend",
    message: "Welcome to the Job Application System",
    timestamp: new Date().toISOString(),
  });
});

// API Hello World endpoint
app.get("/api", (_req: Request, res: Response) => {
  res.json({ message: "Hello World! 🌍" });
});

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});
app.get("/job-roles-from-api", jobRoleAPIController.getJobRoles);
// Job roles routes using dependency injection
app.get("/job-roles", jobRoleController.getJobRolesList);
app.get("/job-roles/:id", jobRoleController.getJobRoleDetail);

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
