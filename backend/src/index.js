import express from "express";
import cors from "cors";
import tasksRouter from "./routes/tasks.js";

const app = express();
const PORT = process.env.PORT || 5000;

// --- middleware pipeline (runs in order on every request) ---
app.use(cors());            // allow the React app's origin to call us
app.use(express.json());    // parse JSON request bodies into req.body

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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`TaskFlow API listening on port ${PORT}`);
});