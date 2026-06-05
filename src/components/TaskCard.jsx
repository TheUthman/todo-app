export default function TaskCard({ task, onToggle }) {
  if (!task) return null;

  // Format strings for clean human readability (e.g., IN_PROGRESS -> In Progress)
  const formatLabel = (str) => {
    if (!str) return "";
    return str
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div className="task-card">
      <div
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "flex-start",
          marginBottom: "12px",
        }}
      >
        <label className="quick-checkbox-container">
          <input
            type="checkbox"
            checked={task.status === "COMPLETED"}
            onChange={onToggle}
          />
          <span className="checkmark"></span>
        </label>
        <div>
          <h4>{task.title || "Untitled Task"}</h4>
          {task.description && <p>{task.description}</p>}
        </div>
      </div>

      {/* Structured flex alignment wrap layer */}
      <div className="task-card-badges">
        {task.priority && (
          <span
            className={`priority ${task.priority.toUpperCase()}`}
            aria-label={`Priority: ${task.priority}`}
          >
            {formatLabel(task.priority)}
          </span>
        )}

        {task.status && (
          <span
            className={`status ${task.status.toUpperCase()}`}
            aria-label={`Status: ${task.status}`}
          >
            {formatLabel(task.status)}
          </span>
        )}
      </div>
    </div>
  );
}
