import { Router } from "express";
import * as store from "../store.js";

const router = Router();

// GET /api/tasks — list all tasks
router.get("/", (req, res) => {
  res.json(store.getAll());
});

// POST /api/tasks — create a task. Body: { "title": "..." }
router.post("/", (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: "title is required" });
  }
  const task = store.create(title.trim());
  res.status(201).json(task); // 201 = Created
});

// PATCH /api/tasks/:id/toggle — flip done/undone
router.patch("/:id/toggle", (req, res) => {
  const task = store.toggle(Number(req.params.id));
  if (!task) return res.status(404).json({ error: "task not found" });
  res.json(task);
});

// DELETE /api/tasks/:id
router.delete("/:id", (req, res) => {
  const deleted = store.remove(Number(req.params.id));
  if (!deleted) return res.status(404).json({ error: "task not found" });
  res.status(204).end(); // 204 = No Content (success, nothing to return)
});

export default router;