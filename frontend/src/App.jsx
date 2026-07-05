import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm.jsx";
import TaskList from "./components/TaskList.jsx";
import * as api from "./api.js";
import "./App.css";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Runs once after the first render ([] dependency array = "on mount").
  useEffect(() => {
    api
      .fetchTasks()
      .then(setTasks)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const addTask = async (title) => {
    const created = await api.createTask(title);
    setTasks((prev) => [...prev, created]);   // never mutate state; copy it
  };

  const toggleTask = async (id) => {
    const updated = await api.toggleTask(id);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const deleteTask = async (id) => {
    await api.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  if (loading) return <main className="app"><p>Loading…</p></main>;
  if (error)   return <main className="app"><p className="error">Error: {error}</p></main>;

  return (
    <main className="app">
      <h1>TaskFlow</h1>
      <TaskForm onAdd={addTask} />
      <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />
      <footer>
        {tasks.filter((t) => t.done).length} / {tasks.length} done
      </footer>
    </main>
  );
}