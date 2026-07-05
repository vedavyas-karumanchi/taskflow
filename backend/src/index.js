import express from "express";
import cors from "cors";
import tasksRouter from "./routes/tasks.js";
import { register, metricsMiddleware } from "./metrics.js";

console.log("✓ index.js loaded with metrics endpoint");

const app = express();
const PORT = process.env.PORT || 5000;

// --- middleware pipeline (runs in order on every request) ---
app.use(cors());            // allow the React app's origin to call us
app.use(express.json());    // parse JSON request bodies into req.body
app.use(metricsMiddleware);  // ← BEFORE routes, so it wraps them all
// simple request logger — in production you'd use a library like pino
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // pass control to the next middleware/route
});

// --- routes ---
app.use("/api/tasks", tasksRouter);

// health check — every production service has one; load balancers,
// Kubernetes, and docker compose use it to know the app is alive
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// The endpoint Prometheus scrapes. Returns text like:
//   http_requests_total{method="GET",route="/api/tasks",status="200"} 42
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`TaskFlow API listening on port ${PORT}`);
});