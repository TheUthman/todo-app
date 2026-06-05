/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useRef } from "react";
import { FaTimes, FaCalendarAlt, FaTags, FaExclamationCircle, FaTasks, FaChevronDown } from "react-icons/fa";
import api from "../api";
import "../styles/modal.css";

export default function EditTaskModal({ open, onClose, onTaskUpdated, task }) {
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

  // Load and normalize core initial dataset structures
  useEffect(() => {
    if (!open || !task) return;

    const formattedDate = task.dueDate ? task.dueDate.split("T")[0] : "";

    setForm({
      title: task.title || "",
      description: task.description || "",
      priority: task.priority || "MEDIUM",
      status: task.status || "TODO",
      dueDate: formattedDate,
      categoryId: task.categoryId || "",
    });

    const loadCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data || []);
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    };

    loadCategories();
  }, [open, task]);

  // Closes the custom category dropdown automatically when clicking anywhere outside
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
      await api.put(`/tasks/${task.id}`, form);
      onTaskUpdated();
      onClose();
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  if (!open || !task) return null;

  // Resolve the string text name of the currently selected category option
  const currentCategoryLabel = categories.find((c) => c.id === form.categoryId)?.name || "Select Category";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        
        {/* Header Block */}
        <div className="modal-header">
          <div>
            <h2>Edit Task</h2>
            <p className="modal-subtitle">Modify task properties and workflow states</p>
          </div>
          <button onClick={onClose} className="close-btn" aria-label="Close modal">
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
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          {/* Inline Selection Row: Status and Priority segmented badges */}
          <div className="form-row split-grid">
            
            <div className="form-group">
              <label className="form-label"><FaTasks /> Status</label>
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
              <label className="form-label"><FaExclamationCircle /> Priority</label>
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
              <label className="form-label"><FaCalendarAlt /> Due Date</label>
              <input
                type="date"
                className="form-input icon-input-field"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label"><FaTags /> Category</label>
              
              {/* UPGRADED: True Custom Dropdown Interface Element */}
              <div className="modal-custom-select-wrapper" ref={categoryRef}>
                <button
                  type="button"
                  className={`modal-custom-select-trigger ${form.categoryId ? "has-value" : ""}`}
                  onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                >
                  <span>{currentCategoryLabel}</span>
                  <FaChevronDown className={`modal-arrow-icon ${categoryDropdownOpen ? "rotated" : ""}`} />
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
              {/* Hidden structural input to maintain html form required validation metrics safely */}
              <input type="hidden" name="categoryId" required value={form.categoryId} />
            </div>

          </div>

          {/* Actions Footer */}
          <div className="modal-actions-footer">
            <button type="button" className="cancel-action-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-action-btn">
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}