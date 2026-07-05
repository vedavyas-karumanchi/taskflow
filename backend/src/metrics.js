import client from "prom-client";

// 1. A Registry holds all metrics this process exposes.
export const register = new client.Registry();

// 2. Default metrics: event-loop lag, heap usage, GC pauses, CPU.
//    Free Node.js runtime observability — always enable in real services.
client.collectDefaultMetrics({ register });

// 3. Counter: total HTTP requests, dimensioned by labels.
export const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",             // metric name queried in PromQL
  help: "Total number of HTTP requests",   // human description (required)
  labelNames: ["method", "route", "status"],
  registers: [register],
});

// 4. Histogram: request duration in seconds (Prometheus convention: base
//    units — seconds, bytes). Buckets chosen around expected latencies;
//    each bucket counts requests that finished within that many seconds.
export const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status"],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5],
  registers: [register],
});

// 5. Express middleware that measures EVERY request.
export function metricsMiddleware(req, res, next) {
  // startTimer() records "now" and returns a function that, when called,
  // observes the elapsed seconds into the histogram with given labels.
  const end = httpRequestDuration.startTimer();

  // "finish" fires when the response has been handed to the OS —
  // measuring here captures the full server-side duration.
  res.on("finish", () => {
    // req.route?.path is the PATTERN ("/:id/toggle"), not the concrete
    // URL ("/17/toggle"). Critical: labeling by concrete URL would create
    // a new time series per task ID — a "cardinality explosion" that
    // bloats Prometheus memory. Real incidents happen from this mistake.
    const route = req.route?.path
      ? req.baseUrl + req.route.path
      : req.originalUrl.split("?")[0];

    const labels = { method: req.method, route, status: res.statusCode };
    httpRequestsTotal.inc(labels);   // counter += 1
    end(labels);                     // histogram.observe(elapsedSeconds)
  });

  next(); // hand off to the next middleware — never forget this
}