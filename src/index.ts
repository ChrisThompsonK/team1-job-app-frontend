import path from "node:path";
import cookieParser from "cookie-parser";
import cors from "cors";
import type { Request, Response } from "express";
import express from "express";
import { handle as i18nextHandle } from "i18next-http-middleware";
import nunjucks from "nunjucks";
import { env } from "./config/env.js";
import i18next from "./config/i18n.js";
import { JobRoleController } from "./controllers/jobRoleController.js";
import { JobRoleApiService } from "./services/jobRoleApiService.js";
import { JobRoleValidator } from "./validators/JobRoleValidator.js";

const app = express();
const port = env.port;

// Configure Nunjucks
const _nunjucksEnv = nunjucks.configure(path.join(process.cwd(), "views"), {
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
app.use(cookieParser());
app.use(cors());

// Add i18n middleware
app.use(i18nextHandle(i18next));

// Middleware to expose i18n to templates via res.locals
app.use((req, res, next) => {
  res.locals.t = req.t.bind(req);
  res.locals.currentLanguage = req.language || "en";
  next();
});

// Middleware to ensure res.locals are passed to all Nunjucks renders
app.use((_req, res, next) => {
  const originalRender = res.render.bind(res);
  res.render = (
    view: string,
    locals?: object,
    callback?: (err: Error, html: string) => void
  ) => {
    const mergedLocals = { ...res.locals, ...(locals || {}) };
    return originalRender(view, mergedLocals, callback);
  };
  next();
});
// Initialize services and controllers with dependency injection
// SWITCHED TO API SERVICE TO CONNECT TO BACKEND
const backendURL = process.env.BACKEND_URL || "http://localhost:3001/api";
const jobRoleService = new JobRoleApiService(backendURL);
const jobRoleValidator = new JobRoleValidator();
const jobRoleController = new JobRoleController(
  jobRoleService,
  jobRoleValidator
);

// Language change endpoint
app.post("/change-language", (req: Request, res: Response) => {
  const { language } = req.body;
  if (["en", "es", "fr", "pl"].includes(language)) {
    res.cookie("i18next", language, { maxAge: 365 * 24 * 60 * 60 * 1000 });
    res.json({ success: true, language });
  } else {
    res.status(400).json({ success: false, error: "Invalid language" });
  }
});

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
app.get("/job-roles/:id/edit", jobRoleController.getJobRoleEdit);
app.post("/job-roles/:id/edit", (req, res, next) => {
  jobRoleController.updateJobRole(req, res).catch(next);
});
app.post("/job-roles/:id/delete", jobRoleController.deleteJobRole);

// Authentication routes
app.get("/login", (_req: Request, res: Response) => {
  res.render("login", {
    title: "Login & Sign Up",
    currentPage: "login",
  });
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
