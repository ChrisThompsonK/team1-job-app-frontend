import "dotenv/config";
import path from "node:path";
import axios from "axios";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import FormData from "form-data";
import { handle as i18nextHandle } from "i18next-http-middleware";
import multer from "multer";
import nunjucks from "nunjucks";
import { env } from "./config/env.js";
import i18next from "./config/i18n.js";
import { analyticsController } from "./controllers/analyticsController.js";
import { ApplicantsController } from "./controllers/applicantsController.js";
import { AuthController } from "./controllers/authController.js";
import { HomeController } from "./controllers/homeController.js";
import { JobApplicationController } from "./controllers/jobApplicationController.js";
import { JobRoleController } from "./controllers/jobRoleController.js";
import { requireAuth } from "./middleware/authMiddleware.js";
import { JobRoleApiService } from "./services/jobRoleApiService.js";
import { encodeJobId } from "./utils/jobSecurity.js";
import {
  getTranslatedBand,
  getTranslatedCapability,
  getTranslatedDescription,
  getTranslatedJobTitle,
  getTranslatedResponsibilities,
  getTranslatedStatus,
} from "./utils/jobTranslations.js";
import { JobRoleValidator } from "./validators/JobRoleValidator.js";

const app = express();
const port = env.port;

// Configure Nunjucks
const nunjucksEnv = nunjucks.configure(path.join(process.cwd(), "views"), {
  autoescape: true,
  express: app,
  noCache: env.nodeEnv === "development",
  watch: env.nodeEnv === "development",
});

// Add translation helper functions to Nunjucks global context
nunjucksEnv.addGlobal("translateCapability", getTranslatedCapability);
nunjucksEnv.addGlobal("translateBand", getTranslatedBand);
nunjucksEnv.addGlobal("translateStatus", getTranslatedStatus);
nunjucksEnv.addGlobal("translateJobTitle", getTranslatedJobTitle);
nunjucksEnv.addGlobal("translateDescription", getTranslatedDescription);
nunjucksEnv.addGlobal(
  "translateResponsibilities",
  getTranslatedResponsibilities
);
nunjucksEnv.addGlobal("encodeJobId", encodeJobId);

// Set Nunjucks as the view engine
app.set("view engine", "njk");

// Serve static files from public directory
app.use(express.static(path.join(process.cwd(), "public")));

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.use((_req, res, next) => {
  res.locals.env = {
    GA4_MEASUREMENT_ID: process.env.GA4_MEASUREMENT_ID,
    NODE_ENV: process.env.NODE_ENV,
  };
  next();
});

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

// Initialize auth controller
const authController = new AuthController();

// Initialize home controller
const homeController = new HomeController();

// Initialize job application controller
const jobApplicationController = new JobApplicationController(jobRoleService);

// Initialize applicants controller
const applicantsController = new ApplicantsController();

// Language change endpoint
app.post("/change-language", homeController.changeLanguage);

// Hello World endpoint
app.get("/", homeController.getHome);

// API Hello World endpoint
app.get("/api", homeController.getApi);

// Health check endpoint
app.get("/health", homeController.getHealth);

// Authentication routes
app.post("/auth/login", (req, res, next) => {
  authController.login(req, res).catch(next);
});

app.post("/auth/signup", (req, res, next) => {
  authController.signup(req, res).catch(next);
});

app.post("/auth/logout", (req, res, _next) => {
  authController.logout(req, res);
});

app.get("/auth/session", (req, res, _next) => {
  authController.checkAuthStatus(req, res);
});

app.get("/login", authController.getLogin);

// Profile route - protected endpoint
app.get("/profile", (req, res, next) => {
  authController.getProfile(req, res).catch(next);
});

// Analytics routes - protected endpoints
app.get("/api/analytics/dashboard", requireAuth, (req, res, next) => {
  analyticsController.getDashboard(req, res).catch(next);
});
app.get("/api/analytics/page-views", requireAuth, (req, res, next) => {
  analyticsController.getPageViews(req, res).catch(next);
});
app.get("/api/analytics/job-roles", requireAuth, (req, res, next) => {
  analyticsController.getJobRoleAnalytics(req, res).catch(next);
});
app.get("/api/analytics/events", requireAuth, (req, res, next) => {
  analyticsController.getEventAnalytics(req, res).catch(next);
});

// Applicants routes - admin only
app.get("/applicants", applicantsController.getApplicantsList);
app.get("/applicants/export", applicantsController.exportApplicantsCSV);

// Job roles routes
app.get("/job-roles", jobRoleController.getJobRolesList);
app.get("/job-roles/export", jobRoleController.exportJobRolesCSV);
app.get("/job-roles/add", jobRoleController.getJobRoleAdd);
app.post("/job-roles/add", (req, res, next) => {
  jobRoleController.createJobRole(req, res).catch(next);
});
app.get("/job-roles/:id", jobRoleController.getJobRoleDetail);
app.get("/job-roles/:id/edit", jobRoleController.getJobRoleEdit);
app.post("/job-roles/:id/edit", (req, res, next) => {
  jobRoleController.updateJobRole(req, res).catch(next);
});
app.post("/job-roles/:id/delete", jobRoleController.deleteJobRole);

// Job application routes - require authentication
app.get(
  "/job-roles/:id/apply",
  requireAuth,
  jobApplicationController.getJobApplication
);
app.post(
  "/job-roles/:id/apply",
  requireAuth,
  jobApplicationController.submitJobApplication
);

// API proxy for application submission
const upload = multer();
app.post(
  "/api/applications",
  upload.fields([
    { name: "cv", maxCount: 1 },
    { name: "coverLetter", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";

      // Create FormData for the backend request
      const formData = new FormData();

      // Add regular form fields
      if (req.body.jobId) formData.append("jobId", req.body.jobId);

      // Add files
      if (req.files && typeof req.files === "object") {
        const files = req.files as {
          [fieldname: string]: Express.Multer.File[];
        };

        if (files.cv?.[0]) {
          const cvFile = files.cv[0];
          formData.append("cv", cvFile.buffer, {
            filename: cvFile.originalname,
            contentType: cvFile.mimetype,
          });
        }

        if (files.coverLetter?.[0]) {
          const coverLetterFile = files.coverLetter[0];
          formData.append("coverLetter", coverLetterFile.buffer, {
            filename: coverLetterFile.originalname,
            contentType: coverLetterFile.mimetype,
          });
        }
      }

      // Forward the request to backend with authentication cookies
      const response = await axios.post(
        `${backendUrl}/api/applications`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            Cookie: req.headers.cookie || "",
          },
        }
      );

      res.status(response.status).json(response.data);
    } catch (error: unknown) {
      console.error("Error proxying application request:", error);
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response: { status: number; data: unknown };
        };
        res.status(axiosError.response.status).json(axiosError.response.data);
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to submit application",
        });
      }
    }
  }
);

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
