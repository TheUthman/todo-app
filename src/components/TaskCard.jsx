const formatLabel = (str) => {
  if (!str) return "";
  return str
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

export default function TaskCard({ task, onToggle }) {
  if (!task) return null;

  const priorityClass = task.priority?.toLowerCase() || "low";
  const statusClass = task.status?.toLowerCase().replace("_", "-") || "todo";

  return (
    <div className="task-card">
      <div className="task-card-header">
        <label className="quick-checkbox-container">
          <input
            type="checkbox"
            checked={task.status === "COMPLETED"}
            onChange={onToggle}
          />
          <span className="checkmark" />
        </label>
        <div className="task-card-content">
          <h4>{task.title || "Untitled Task"}</h4>
          {task.description && <p>{task.description}</p>}
        </div>
      </div>

      <div className="task-card-badges">
        {task.priority && (
          <span
            className={`badge-priority ${priorityClass}`}
            aria-label={`Priority: ${task.priority}`}
          >
            {formatLabel(task.priority)}
          </span>
        )}
        {task.status && (
          <span
            className={`badge-status ${statusClass}`}
            aria-label={`Status: ${task.status}`}
          >
            {formatLabel(task.status)}
          </span>
        )}
      </div>
    </div>
  );
}
