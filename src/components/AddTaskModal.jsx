/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useRef } from "react";
import {
  FaTimes,
  FaCalendarAlt,
  FaTags,
  FaExclamationCircle,
  FaTasks,
  FaChevronDown,
} from "react-icons/fa";
import api from "../api";
import "../styles/modal.css";

export default function AddTaskModal({
  open,
  onClose,
  onTaskCreated,
  categoryId,
}) {
  const [categories, setCategories] = useState([]);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const categoryRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    status: "TODO",
    dueDate: "",
    categoryId: "",
  });

  // Load backend categories when the create workflow opens
  useEffect(() => {
    if (!open) return;

    const loadCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data || []);
      } catch (err) {
        console.error("Error loading workspace categories:", err);
      }
    };

    loadCategories();
  }, [open]);

  // Pre-select category if provided via props (e.g. from CategoryDetails page)
  useEffect(() => {
    if (open && categoryId) {
      setForm((prev) => ({ ...prev, categoryId }));
    }
  }, [open, categoryId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const submitTask = async (e) => {
    e.preventDefault();
    try {
      await api.post("/tasks", form);
      onTaskCreated();
      onClose();
      setForm({
        title: "",
        description: "",
        priority: "MEDIUM",
        status: "TODO",
        dueDate: "",
        categoryId: "",
      });
    } catch (err) {
      console.error("Error creating new task record:", err);
    }
  };

  if (!open) return null;

  const currentCategoryLabel =
    categories.find((c) => c.id === form.categoryId)?.name || "Select Category";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header Block */}
        <div className="modal-header">
          <div>
            <h2>Create Task</h2>
            <p className="modal-subtitle">
              Add a new item to your trackable workspace workflows
            </p>
          </div>
          <button
            onClick={onClose}
            className="close-btn"
            aria-label="Close modal"
          >
            <FaTimes />
          </button>
        </div>

        {/* Input Interactive Space */}
        <form onSubmit={submitTask} className="modal-form">
          <div className="form-group">
            <label className="form-label">Task Title</label>
            <input
              type="text"
              placeholder="What needs to be done?"
              required
              className="form-input text-title-input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              placeholder="Add more details or notes about this task..."
              rows="3"
              className="form-input text-area-input"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          {/* Inline Selection Row: Status and Priority segmented badges */}
          <div className="form-row split-grid">
            <div className="form-group">
              <label className="form-label">
                <FaTasks /> Status
              </label>
              <div className="custom-tile-group">
                {["TODO", "IN_PROGRESS", "COMPLETED"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    className={`tile-btn status-${st.toLowerCase()} ${form.status === st ? "active" : ""}`}
                    onClick={() => setForm({ ...form, status: st })}
                  >
                    {st.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <FaExclamationCircle /> Priority
              </label>
              <div className="custom-tile-group">
                {["LOW", "MEDIUM", "HIGH"].map((pr) => (
                  <button
                    key={pr}
                    type="button"
                    className={`tile-btn priority-${pr.toLowerCase()} ${form.priority === pr ? "active" : ""}`}
                    onClick={() => setForm({ ...form, priority: pr })}
                  >
                    {pr}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Inline Selection Row: Category and Due Date inputs */}
          <div className="form-row split-grid">
            <div className="form-group">
              <label className="form-label">
                <FaCalendarAlt /> Due Date
              </label>
              <input
                type="date"
                className="form-input icon-input-field"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <FaTags /> Category
              </label>

              <div className="modal-custom-select-wrapper" ref={categoryRef}>
                <button
                  type="button"
                  className={`modal-custom-select-trigger ${form.categoryId ? "has-value" : ""}`}
                  onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                >
                  <span>{currentCategoryLabel}</span>
                  <FaChevronDown
                    className={`modal-arrow-icon ${categoryDropdownOpen ? "rotated" : ""}`}
                  />
                </button>

                {categoryDropdownOpen && (
                  <ul className="modal-custom-select-dropdown">
                    <li
                      className={`modal-custom-select-option unselected-placeholder ${!form.categoryId ? "selected" : ""}`}
                      onClick={() => {
                        setForm({ ...form, categoryId: "" });
                        setCategoryDropdownOpen(false);
                      }}
                    >
                      Select Category
                    </li>
                    {categories.map((cat) => (
                      <li
                        key={cat.id}
                        className={`modal-custom-select-option ${form.categoryId === cat.id ? "selected" : ""}`}
                        onClick={() => {
                          setForm({ ...form, categoryId: cat.id });
                          setCategoryDropdownOpen(false);
                        }}
                      >
                        {cat.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {/* Hidden semantic backup field to cleanly maintain form validation rules */}
              <input
                type="hidden"
                name="categoryId"
                required
                value={form.categoryId}
              />
            </div>
          </div>

          {/* Actions Footer */}
          <div className="modal-actions-footer">
            <button
              type="button"
              className="cancel-action-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="save-action-btn">
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
