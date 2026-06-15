import { FaEdit, FaTrash, FaChevronDown } from "react-icons/fa";
import { useState } from "react";
import "../styles/taskgridview.css";

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

const STATUS_ORDER = ["TODO", "IN_PROGRESS", "COMPLETED"];

export default function TaskGridView({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  const [openStatusDropdown, setOpenStatusDropdown] = useState(null);

  const getNextStatus = (currentStatus) => {
    const currentIndex = STATUS_ORDER.indexOf(currentStatus || "TODO");
    const nextIndex = (currentIndex + 1) % STATUS_ORDER.length;
    return STATUS_ORDER[nextIndex];
  };

  const handleStatusChange = (taskId, newStatus) => {
    onStatusChange({ id: taskId }, newStatus);
    setOpenStatusDropdown(null);
  };

  const handleQuickAdvance = (e, task) => {
    e.stopPropagation();
    const nextStatus = getNextStatus(task.status);
    handleStatusChange(task.id, nextStatus);
  };

  return (
    <div className="task-grid-container">
      <div className="task-grid">
        {tasks.map((task) => {
          const priorityClass = task.priority?.toLowerCase() || "low";
          const statusClass = task.status?.toLowerCase().replace("_", "-") || "todo";
          const isCompleted = task.status === "COMPLETED";
          const formattedDate = task.dueDate
            ? task.dueDate.split("T")[0]
            : "No date";

          return (
            <article
              key={task.id || task._id}
              className={`task-grid-card ${statusClass} ${isCompleted ? "is-completed" : ""}`}
            >
              {/* Status Badge */}
              <div className="task-grid-status-badge">
                <div className={`status-indicator ${statusClass}`} />
                <span className="status-label">{STATUS_LABELS[task.status] || "To Do"}</span>
              </div>

              {/* Card Content */}
              <div className="task-grid-content">
                <h3 className="task-grid-title">{task.title}</h3>
                {task.description && (
                  <p className="task-grid-description">{task.description}</p>
                )}

                {/* Meta Information */}
                <div className="task-grid-meta">
                  <span className={`badge-priority ${priorityClass}`}>
                    {formatLabel(task.priority)}
                  </span>
                  {task.categoryName && (
                    <span className="badge-category">{task.categoryName}</span>
                  )}
                </div>

                {/* Due Date */}
                {task.dueDate && (
                  <div className="task-grid-date">
                    <span>{formattedDate}</span>
                  </div>
                )}
              </div>

              {/* Card Footer - Actions */}
              <div className="task-grid-footer">
                <div className="status-selector-wrapper">
                  <button
                    className="btn-status-quick"
                    onClick={(e) => handleQuickAdvance(e, task)}
                    title="Quick advance status"
                  >
                    Next
                  </button>
                  <div className="status-dropdown-container">
                    <button
                      className="btn-status-dropdown"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenStatusDropdown(
                          openStatusDropdown === task.id ? null : task.id
                        );
                      }}
                      aria-expanded={openStatusDropdown === task.id}
                    >
                      <FaChevronDown />
                    </button>
                    {openStatusDropdown === task.id && (
                      <div className="status-dropdown-menu">
                        {STATUS_ORDER.map((status) => (
                          <button
                            key={status}
                            className={`status-dropdown-item ${
                              task.status === status ? "active" : ""
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(task.id, status);
                            }}
                          >
                            {STATUS_LABELS[status]}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="task-grid-actions">
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
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
