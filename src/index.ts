import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Request, Response } from "express";
import express from "express";
import nunjucks from "nunjucks";

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Configure Nunjucks
nunjucks.configure(path.join(__dirname, "../templates"), {
  autoescape: true,
  express: app,
});

// Set Nunjucks as the view engine
app.set("view engine", "njk");

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "../public")));

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
