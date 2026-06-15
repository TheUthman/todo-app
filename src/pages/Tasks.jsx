/* eslint-disable react-hooks/immutability */
import { useEffect, useState, useMemo } from "react";
import Topbar from "../components/Topbar";
import SearchBar from "../components/SearchBar";
import TaskGridView from "../components/TaskGridView";
import AddTaskModal from "../components/AddTaskModal";
import EditTaskModal from "../components/EditTaskModal";
import EmptyState from "../components/EmptyState";
import ConfirmModal from "../components/ConfirmModal";
import api from "../api";

import { FaPlus } from "react-icons/fa";
import "../styles/tasks.css";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [confirmDeleteTaskId, setConfirmDeleteTaskId] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/tasks");
      setTasks(res.data || []);
    } catch (err) {
      console.error("Failed to fetch primary workspace tasks array:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (task) => {
    const originalStatus = task.status;
    const nextStatus = originalStatus === "COMPLETED" ? "TODO" : "COMPLETED";

    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t))
    );

    try {
      await api.put(`/tasks/${task.id}`, {
        ...task,
        status: nextStatus,
      });
    } catch (err) {
      console.error("Failed to commit task status flip modification:", err);
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === task.id ? { ...t, status: originalStatus } : t))
      );
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    const originalStatus = task.status;

    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
    );

    try {
      await api.put(`/tasks/${task.id}`, {
        ...task,
        status: newStatus,
      });
    } catch (err) {
      console.error("Failed to update task status:", err);
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === task.id ? { ...t, status: originalStatus } : t))
      );
    }
  };

  const handleEditClick = (task) => {
    setTaskToEdit(task);
    setShowEditModal(true);
  };

  const handleDeleteClick = async () => {
    if (!confirmDeleteTaskId) return;
    try {
      await api.delete(`/tasks/${confirmDeleteTaskId}`);
      setConfirmDeleteTaskId(null);
      loadTasks();
    } catch (err) {
      console.error("Target task destruction endpoint request error:", err);
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) =>
      task.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tasks, searchQuery]);

  return (
    <div className="page-content tasks-page">
      <Topbar
        title="Tasks"
        subtitle="Keep tabs on priorities and lifecycle schedules"
      />

      <div className="page-toolbar">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks by title..."
        />
        <button className="btn-add-task" onClick={() => setShowAddModal(true)}>
          <FaPlus />
          <span>Add Task</span>
        </button>
      </div>

      {loading ? (
        <div className="tasks-loading-shimmer-wrapper">
          <div className="loading-spinner" />
          <p>Syncing task workflow streams...</p>
        </div>
      ) : filteredTasks.length > 0 ? (
        <TaskGridView
          tasks={filteredTasks}
          onEdit={handleEditClick}
          onDelete={(id) => setConfirmDeleteTaskId(id)}
          onStatusChange={handleStatusChange}
        />
      ) : (
        <EmptyState
          title={searchQuery ? "No search matches found" : "No tasks documented yet"}
          description={
            searchQuery
              ? "Try checking your syntax or clear the search criteria input field."
              : "Get started by logging a fresh task entry using the button above."
          }
        />
      )}

      <AddTaskModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onTaskCreated={loadTasks}
      />

      <EditTaskModal
        open={showEditModal}
        task={taskToEdit}
        onClose={() => {
          setShowEditModal(false);
          setTaskToEdit(null);
        }}
        onTaskUpdated={loadTasks}
      />

      {confirmDeleteTaskId && (
        <ConfirmModal
          title="Permanently remove task item?"
          description="This workflow destruction action cannot be reversed from server logging records."
          onConfirm={handleDeleteClick}
          onClose={() => setConfirmDeleteTaskId(null)}
        />
      )}
    </div>
  );
}
