import path from "node:path";
import cors from "cors";
import type { Request, Response } from "express";
import express from "express";
import nunjucks from "nunjucks";
import { JobRoleController } from "./controllers/jobRoleController.js";
import { JobRoleApiService } from "./services/jobRoleApiService.js";

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
app.use(cors());
// Initialize services and controllers with dependency injection
// SWITCHED TO API SERVICE TO CONNECT TO BACKEND
const backendURL = process.env.BACKEND_URL || "http://localhost:3001/api";
const jobRoleService = new JobRoleApiService(backendURL);
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
app.get("/job-roles/:id", jobRoleController.getJobRoleDetail);
app.post("/job-roles/:id/delete", jobRoleController.deleteJobRole);

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
