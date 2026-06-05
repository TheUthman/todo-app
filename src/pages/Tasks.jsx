/* eslint-disable react-hooks/immutability */
import { useEffect, useState, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import SearchBar from "../components/SearchBar";
import TaskTable from "../components/TaskTable";
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

  // Modal Workspace Tracking Hooks
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
    console.log(`Toggling task ID ${task.id} status from ${originalStatus}...`);
    const nextStatus = originalStatus === "COMPLETED" ? "TODO" : "COMPLETED";

    // 1. Update UI state instantly for zero-latency response
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t))
    );

    try {
      // 2. Sync to API backend in the background
      await api.put(`/tasks/${task.id}`, {
        ...task,
        status: nextStatus,
      });
    } catch (err) {
      console.error("Failed to commit task status flip modification:", err);
      // Rollback to original state if the API pipeline drops out or fails
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

  // Fast Client-Side Realtime Dynamic Filtration Loop
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) =>
      task.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tasks, searchQuery]);

  return (
    <div className="dashboard-layout-root">
      <Sidebar />

      <main className="tasks-page">
        <Topbar
          title="Tasks"
          subtitle="Keep tabs on priorities and lifecycle schedules"
        />

        {/* Global Filter & Command Bar Toolbar wrapper */}
        <div className="filters-container-bar">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks instantly by title..."
          />
          <button className="btn-add-task" onClick={() => setShowAddModal(true)}>
            <FaPlus />
            <span>Add Task</span>
          </button>
        </div>

        {/* Workspace Conditional Viewport Logic */}
        {loading ? (
          <div className="tasks-loading-shimmer-wrapper">
            <div className="loading-spinner"></div>
            <p>Syncing task workflow streams...</p>
          </div>
        ) : filteredTasks.length > 0 ? (
          <TaskTable
            tasks={filteredTasks}
            onEdit={handleEditClick}
            onDelete={(id) => setConfirmDeleteTaskId(id)}
            onToggleComplete={handleToggleComplete} // Injected Quick Toggle prop
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
      </main>

      {/* Action Modals System Hooks Layouts */}
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