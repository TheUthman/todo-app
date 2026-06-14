import { FaEdit, FaTrash, FaCalendarAlt, FaTag, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useState } from "react";
import "../styles/taskgroup.css";

const formatLabel = (str) => {
  if (!str) return "";
  return str
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const STATUS_LABELS = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

const STATUS_COLORS = {
  TODO: "#3b82f6",
  IN_PROGRESS: "#f59e0b",
  COMPLETED: "#10b981",
};

export default function TaskGroup({
  status,
  tasks,
  onEdit,
  onDelete,
  onToggleComplete,
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!tasks || tasks.length === 0) return null;

  return (
    <section className="task-group">
      <button
        className="task-group-header"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <div className="task-group-title-wrapper">
          <div
            className="task-group-status-dot"
            style={{ backgroundColor: STATUS_COLORS[status] }}
          />
          <h3 className="task-group-title">{STATUS_LABELS[status]}</h3>
          <span className="task-group-count">{tasks.length}</span>
        </div>
        <div className="task-group-toggle-icon">
          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </button>

      {isExpanded && (
        <div className="task-group-items">
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
      )}
    </section>
  );
}
