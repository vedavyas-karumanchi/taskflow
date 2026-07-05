// A minimal in-memory store. Data resets when the server restarts —
// perfectly fine for learning; a database replaces this file later.
let tasks = [
  { id: 1, title: "Learn Node.js", done: true },
  { id: 2, title: "Learn React", done: false },
  { id: 3, title: "Dockerize everything", done: false },
];
let nextId = 4;

export const getAll = () => tasks;

export const create = (title) => {
  const task = { id: nextId++, title, done: false };
  tasks.push(task);
  return task;
};

export const toggle = (id) => {
  const task = tasks.find((t) => t.id === id);
  if (task) task.done = !task.done;
  return task; // undefined if not found
};

export const remove = (id) => {
  const before = tasks.length;
  tasks = tasks.filter((t) => t.id !== id);
  return tasks.length < before; // true if something was deleted
};