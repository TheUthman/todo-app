import { FaEdit, FaTrash, FaCalendarAlt, FaTag } from "react-icons/fa";
import "../styles/tasklist.css";

const formatLabel = (str) => {
  if (!str) return "";
  return str
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

export default function TaskList({
  tasks,
  onDelete,
  onEdit,
  onToggleComplete,
}) {
  return (
    <div className="task-list">
      {tasks.map((task) => {
        const isCompleted = task.status === "COMPLETED";
        const formattedDate = task.dueDate
          ? task.dueDate.split("T")[0]
          : "No date";
        const priorityClass = task.priority?.toLowerCase() || "low";
        const statusClass =
          task.status?.toLowerCase().replace("_", "-") || "todo";

        return (
          <article
            key={task.id || task._id}
            className={`task-list-item ${isCompleted ? "is-completed" : ""}`}
          >
            <label className="quick-checkbox-container">
              <input
                type="checkbox"
                checked={isCompleted}
                onChange={() => onToggleComplete(task)}
              />
              <span className="checkmark" />
            </label>

            <div className="task-list-body">
              <div className="task-info-group">
                <h4 className="task-list-title">{task.title}</h4>
                {task.description && (
                  <p className="task-list-desc">{task.description}</p>
                )}
              </div>

              <div className="task-list-meta">
                <div className="meta-badges">
                  <span className={`badge-priority ${priorityClass}`}>
                    {formatLabel(task.priority)}
                  </span>
                  <span className={`badge-status ${statusClass}`}>
                    {formatLabel(task.status)}
                  </span>
                </div>
                <div className="meta-details">
                  <span className="task-list-date">
                    <FaCalendarAlt /> {formattedDate}
                  </span>
                  {task.categoryName && (
                    <span className="task-list-cat">
                      <FaTag style={{width:"" , height:""}} /> {task.categoryName}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="task-list-actions">
              <button
                type="button"
                className="task-action-btn edit"
                onClick={() => onEdit(task)}
                aria-label="Edit task"
              >
                <FaEdit />
              </button>
              <button
                type="button"
                className="task-action-btn delete"
                onClick={() => onDelete(task.id)}
                aria-label="Delete task"
              >
                <FaTrash />
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
