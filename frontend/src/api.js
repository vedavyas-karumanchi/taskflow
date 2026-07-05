// All backend communication lives here.
// In dev, Vite proxies "/api" to the backend (see vite.config.js).
// In Docker, nginx does the same proxying. Components never care.
const BASE = "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
}

export const fetchTasks = () => request("/tasks");
export const createTask = (title) =>
  request("/tasks", { method: "POST", body: JSON.stringify({ title }) });
export const toggleTask = (id) =>
  request(`/tasks/${id}/toggle`, { method: "PATCH" });
export const deleteTask = (id) =>
  request(`/tasks/${id}`, { method: "DELETE" });