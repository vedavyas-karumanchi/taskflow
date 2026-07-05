export default function TaskList({ tasks, onToggle, onDelete }) {
  if (tasks.length === 0) {
    return <p className="empty">No tasks yet — add your first one above.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} className={task.done ? "done" : ""}>
          <label>
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => onToggle(task.id)}
            />
            <span>{task.title}</span>
          </label>
          <button onClick={() => onDelete(task.id)} aria-label="Delete task">
            ✕
          </button>
        </li>
      ))}
    </ul>
  );
}