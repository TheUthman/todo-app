import TaskGroup from "./TaskGroup";
import "../styles/tasklist.css";

export default function TaskList({
  groupedTasks,
  onDelete,
  onEdit,
  onToggleComplete,
}) {
  const statuses = ["TODO", "IN_PROGRESS", "COMPLETED"];

  return (
    <div className="task-list-container">
      {statuses.map((status) => (
        <TaskGroup
          key={status}
          status={status}
          tasks={groupedTasks[status]}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </div>
  );
}
