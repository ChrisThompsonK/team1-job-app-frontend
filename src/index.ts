import path from "node:path";
import type { Request, Response } from "express";
import express from "express";
import nunjucks from "nunjucks";
import { JobRoleController } from "./controllers/jobRoleController.js";
import { JobRoleMemoryService } from "./services/jobRoleMemoryService.js";
import { ProvideJobRoles } from "./services/jobRoleProvider.js";
import {
  sanitizeJobRoleData,
  validateJobRoleData,
} from "./utils/validation.js";

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

// Job roles routes using dependency injection
app.get("/job-roles", jobRoleController.getJobRolesList);

// API endpoints for job roles
app.get("/api/jobs", (_req: Request, res: Response) => {
  try {
    const jobs = jobRoleService.getAllJobs();
    res.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Unable to fetch job roles",
    });
  }
});

app.post("/api/jobs", (req: Request, res: Response) => {
  try {
    // Validate the request body
    const validation = validateJobRoleData(req.body);

    if (!validation.isValid) {
      res.status(400).json({
        error: "Validation failed",
        details: validation.errors,
      });
      return;
    }

    // Sanitize and create the job role
    const sanitizedData = sanitizeJobRoleData(req.body);
    const newJob = jobRoleService.addJob(sanitizedData);

    res.status(201).json({
      message: "Job role created successfully",
      job: newJob,
    });
  } catch (error) {
    console.error("Error creating job role:", error);
    res.status(500).json({
      error: "Internal server error",
      message:
        error instanceof Error ? error.message : "Unable to create job role",
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
