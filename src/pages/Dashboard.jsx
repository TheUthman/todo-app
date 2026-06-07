/* eslint-disable react-hooks/immutability */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Swapped out raw anchor tags to prevent hard window reloads

import {
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaFolder,
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import TaskCard from "../components/TaskCard";
import EmptyState from "../components/EmptyState";
import AddTaskModal from "../components/AddTaskModal";

import api from "../api";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    completionRate: 0,
  });

  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(true); // Added to eliminate static 0 flashes

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      // Keep loading active on re-fetch cycles to preserve interface continuity
      setGlobalLoading(true);

      const [dashboardRes, tasksRes, categoriesRes] = await Promise.all([
        api.get("/dashboard"),
        api.get("/tasks"),
        api.get("/categories"),
      ]);

      setStats(dashboardRes.data);
      setTasks(tasksRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error("Dashboard synchronization malfunction:", error);
    } finally {
      setGlobalLoading(false);
    }
  };

  const handleToggleComplete = async (task) => {
    const originalStatus = task.status;
    const nextStatus = originalStatus === "COMPLETED" ? "TODO" : "COMPLETED";

    // 1. Update UI state instantly (Optimistic UI)
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === task.id ? { ...t, status: nextStatus } : t,
      ),
    );

    try {
      // 2. Sync to API
      await api.put(`/tasks/${task.id}`, { ...task, status: nextStatus });

      // 3. Refresh dashboard stats to reflect the changes in completion counts
      const res = await api.get("/dashboard");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to update task status from dashboard:", err);
      // Rollback to original state if API fails
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === task.id ? { ...t, status: originalStatus } : t,
        ),
      );
    }
  };

  return (
    <div className="dashboard" style={{ display: "flex", width: "100%" }}>
      <main
        className="main-content"
        style={{ flex: 1, minWidth: 0, transition: "all 0.3s ease" }}
      >
        <Topbar
          title="Dashboard"
          subtitle="Welcome back! Here's what's happening."
        />

        {/* Stats Grid Layout */}
        <section className="stats-grid">
          {globalLoading ? (
            // Injected dynamic UI skeleton arrays while async promises resolve
            Array(4)
              .fill(0)
              .map((_, idx) => (
                <div
                  key={idx}
                  className="stat-card-skeleton animate-pulse-flow"
                />
              ))
          ) : (
            <>
              <StatCard
                title="Total Tasks"
                value={stats.totalTasks}
                icon={<FaTasks />}
                color="var(--color-primary)"
              />
              <StatCard
                title="Completed"
                value={stats.completedTasks}
                icon={<FaCheckCircle />}
                color="var(--success)"
              />
              <StatCard
                title="Pending"
                value={stats.pendingTasks}
                icon={<FaClock />}
                color="var(--warning)"
              />
              <StatCard
                title="Overdue"
                value={stats.overdueTasks}
                icon={<FaExclamationTriangle />}
                color="var(--danger)"
              />
            </>
          )}
        </section>

        {/* Main Operational Data Split Content Grid */}
        <section className="dashboard-grid">
          {/* Recent Tasks Card Compartment */}
          <div className="tasks-card">
            <div className="section-header">
              <h2>Recent Tasks</h2>
              <div className="section-actions">
                <button
                  className="btn-add-task"
                  onClick={() => setShowAddTaskModal(true)}
                  disabled={globalLoading}
                >
                  + Add
                </button>
                <Link to="/tasks" className="section-link">
                  View all →
                </Link>
              </div>
            </div>

            {globalLoading ? (
              <div className="task-cards-grid">
                {Array(2)
                  .fill(0)
                  .map((_, idx) => (
                    <div
                      key={idx}
                      className="task-card-skeleton animate-pulse-flow"
                    />
                  ))}
              </div>
            ) : tasks.length > 0 ? (
              <div className="task-cards-grid">
                {tasks.slice(0, 4).map((task) => (
                  <TaskCard
                    key={task.id || task._id}
                    task={task}
                    onToggle={() => handleToggleComplete(task)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No tasks yet"
                description="Create your first task to get started."
              />
            )}
          </div>

          {/* Categories Organizational Card Compartment */}
          <div className="categories-card">
            <div className="section-header">
              <h2>Categories</h2>
              <Link to="/categories" className="section-link">
                Manage →
              </Link>
            </div>

            {globalLoading ? (
              <div className="category-list">
                {Array(3)
                  .fill(0)
                  .map((_, idx) => (
                    <div
                      key={idx}
                      className="category-item-skeleton animate-pulse-flow"
                    />
                  ))}
              </div>
            ) : categories.length > 0 ? (
              <div className="category-list">
                {categories.map((category) => (
                  <div
                    key={category.id || category._id}
                    className="category-item"
                  >
                    {/* Fallback inline color styles based on custom schema arrays if present */}
                    <div
                      className="category-item-dot"
                      style={{
                        backgroundColor:
                          category.color || "var(--color-primary)",
                      }}
                    />
                    <h4>{category.name}</h4>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No categories"
                description="Create categories to organize tasks."
              />
            )}
          </div>
        </section>
      </main>

      <AddTaskModal
        open={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        onTaskCreated={loadDashboard}
      />
    </div>
  );
}
