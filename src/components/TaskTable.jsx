export default function TaskTable({ tasks, onDelete, onEdit, onToggleComplete }) {
  return (
    <table className="task-table">
      <thead>
        <tr>
          <th style={{ width: "40px" }}></th> {/* Checkbox Column Anchor */}
          <th>Title</th>
          <th>Priority</th>
          <th>Status</th>
          <th>Due Date</th>
          <th style={{ textAlign: "right" }}>Actions</th>
        </tr>
      </thead>

      <tbody>
        {tasks.map((task) => {
          const isCompleted = task.status === "COMPLETED";
          const formattedDate = task.dueDate ? task.dueDate.split("T")[0] : "No date";

          return (
            <tr 
              key={task.id} 
              className={isCompleted ? "status-completed" : ""}
            >
              {/* Quick Toggle Checkbox Cell */}
              <td>
                <label className="quick-checkbox-container">
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={() => onToggleComplete(task)}
                  />
                  <span className="checkmark"></span>
                </label>
              </td>

              {/* Task Core Metadata */}
              <td>{task.title}</td>

              <td>
                <span className={`priority ${task.priority.toLowerCase()}`}>
                  {task.priority}
                </span>
              </td>

              <td>
                <span className={`status ${task.status.toLowerCase().replace("_", "-")}`}>
                  {task.status.replace("_", " ")}
                </span>
              </td>

              <td>{formattedDate}</td>
              
              {/* Row Interactive Context Group */}
              <td>
                <div className="action-buttons" style={{ justifyContent: "flex-end" }}>
                  <button className="edit-btn" onClick={() => onEdit(task)}>
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => onDelete(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}