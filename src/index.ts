import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Request, Response } from "express";
import express from "express";

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "../public")));

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Hello World endpoint
app.get("/", (_req: Request, res: Response) => {
  res.json({
    title: "Job Application Frontend",
    message: "Welcome to the Job Application System",
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
