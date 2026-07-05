import { useState } from "react";

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState("");

  const submit = async (e) => {
    e.preventDefault();               // stop the browser's full-page reload
    if (!title.trim()) return;
    await onAdd(title.trim());        // parent decides what "add" means
    setTitle("");                     // clear the input on success
  };

  return (
    <form onSubmit={submit} className="task-form">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs doing?"
        aria-label="New task title"
      />
      <button type="submit">Add</button>
    </form>
  );
}