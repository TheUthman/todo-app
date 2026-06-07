/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Topbar from "../components/Topbar";
import TaskList from "../components/TaskList";
import SearchBar from "../components/SearchBar";
import EmptyState from "../components/EmptyState";
import EditTaskModal from "../components/EditTaskModal";
import AddTaskModal from "../components/AddTaskModal";
import ConfirmModal from "../components/ConfirmModal";
import { FaArrowLeft, FaChevronDown, FaPlus } from "react-icons/fa";
import api from "../api";
import "../styles/tasks.css";
import "../styles/categories.css";

export default function CategoryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [confirmDeleteTaskId, setConfirmDeleteTaskId] = useState(null);

  const [priorityOpen, setPriorityOpen] = useState(false);
  const priorityRef = useRef(null);

  const priorityOptions = [
    { value: "ALL", label: "All Priorities" },
    { value: "LOW", label: "Low Priority" },
    { value: "MEDIUM", label: "Medium Priority" },
    { value: "HIGH", label: "High Priority" },
  ];

  const currentPriorityLabel =
    priorityOptions.find((o) => o.value === priorityFilter)?.label ||
    priorityFilter;

  const loadCategoryData = useCallback(async () => {
    try {
      setLoading(true);

      const [catRes, tasksRes] = await Promise.all([
        api.get(`/categories/${id}`),
        api.get(`/tasks/category/${id}`),
      ]);

      if (catRes?.data) {
        setCategory(catRes.data);
        setTasks(tasksRes?.data || []);
      }
    } catch (err) {
      if (err.response?.status === 500) {
        console.error(
          "Backend Error (500): The server crashed while fetching tasks for this category. " +
            "Ensure the ID is valid and the endpoint /api/tasks/category/:id exists.",
        );
      }
      console.error("Failed to sync category details:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleToggleComplete = useCallback(async (task) => {
    const originalStatus = task.status;
    const nextStatus = originalStatus === "COMPLETED" ? "TODO" : "COMPLETED";

    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t)),
    );

    try {
      await api.put(`/tasks/${task.id}`, { ...task, status: nextStatus });
    } catch (err) {
      console.error("Status update failed:", err);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, status: originalStatus } : t,
        ),
      );
    }
  }, []);

  const handleEditClick = useCallback((task) => {
    setTaskToEdit(task);
    setShowEditModal(true);
  }, []);

  const handleDeleteTask = useCallback(async () => {
    if (!confirmDeleteTaskId) return;
    try {
      await api.delete(`/tasks/${confirmDeleteTaskId}`);
      setConfirmDeleteTaskId(null);
      loadCategoryData();
    } catch (err) {
      console.error("Task deletion failed:", err);
    }
  }, [confirmDeleteTaskId, loadCategoryData]);

  useEffect(() => {
    loadCategoryData();
  }, [loadCategoryData]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (priorityRef.current && !priorityRef.current.contains(e.target)) {
        setPriorityOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesPriority =
        priorityFilter === "ALL" || t.priority === priorityFilter;
      const matchesSearch =
        t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesPriority && matchesSearch;
    });
  }, [tasks, priorityFilter, searchQuery]);

  return (
    <div className="page-content tasks-page">
      <Topbar
        title={category ? category.name : "Category"}
        subtitle="Viewing all tasks within this organizational group"
      />

      {category && (
        <div className="category-detail-header">
          <span
            className="category-detail-dot"
            style={{ backgroundColor: category.color || "var(--color-primary)" }}
          />
          <span className="category-detail-name">{category.name}</span>
        </div>
      )}

      <div className="page-toolbar">
        <button
          type="button"
          className="primary-action-btn ghost"
          onClick={() => navigate("/categories")}
        >
          <FaArrowLeft /> <span>Back to Categories</span>
        </button>

        <button
          type="button"
          className="primary-action-btn success"
          onClick={() => setShowAddModal(true)}
        >
          <FaPlus /> <span>Add Task</span>
        </button>

        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search within category..."
        />

        <div className="custom-select-wrapper" ref={priorityRef}>
          <button
            type="button"
            className={`custom-select-trigger ${
              priorityFilter !== "ALL" ? "active" : ""
            }`}
            onClick={() => setPriorityOpen(!priorityOpen)}
          >
            <span>{currentPriorityLabel}</span>
            <FaChevronDown
              className={`arrow-icon ${priorityOpen ? "rotated" : ""}`}
            />
          </button>

          {priorityOpen && (
            <ul className="custom-select-dropdown">
              {priorityOptions.map((opt) => (
                <li
                  key={opt.value}
                  className={`custom-select-option ${
                    priorityFilter === opt.value ? "selected" : ""
                  }`}
                  onClick={() => {
                    setPriorityFilter(opt.value);
                    setPriorityOpen(false);
                  }}
                >
                  {opt.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {loading ? (
        <div className="tasks-loading-shimmer-wrapper">
          <div className="loading-spinner" />
          <p>Gathering tasks...</p>
        </div>
      ) : filteredTasks.length > 0 ? (
        <TaskList
          tasks={filteredTasks}
          onEdit={handleEditClick}
          onDelete={(id) => setConfirmDeleteTaskId(id)}
          onToggleComplete={handleToggleComplete}
        />
      ) : (
        <EmptyState
          title={
            priorityFilter !== "ALL" || searchQuery
              ? "No matching tasks"
              : "No tasks in this category"
          }
          description={
            priorityFilter !== "ALL" || searchQuery
              ? "Try selecting a different priority or clear the filter."
              : "Assign tasks to this category to see them listed here."
          }
        />
      )}

      <AddTaskModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onTaskCreated={loadCategoryData}
        categoryId={id}
      />

      <EditTaskModal
        open={showEditModal}
        task={taskToEdit}
        onClose={() => {
          setShowEditModal(false);
          setTaskToEdit(null);
        }}
        onTaskUpdated={loadCategoryData}
      />

      {confirmDeleteTaskId && (
        <ConfirmModal
          title="Delete task?"
          description="This will permanently remove the task."
          onConfirm={handleDeleteTask}
          onClose={() => setConfirmDeleteTaskId(null)}
        />
      )}
    </div>
  );
}
