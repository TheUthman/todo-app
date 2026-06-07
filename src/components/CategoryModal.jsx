/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import api from "../api";
import "../styles/modal.css";

const PRESET_COLORS = [
  "#004e98", // Deep Blue (Brand Primary)
  "#3a6ea5", // Steel Blue (Brand Secondary)
  "#ff6700", // Safety Orange (Accent)
  "#22c55e", // Green
  "#8b5cf6", // Purple
  "#ef4444", // Red
  "#f59e0b", // Amber/Yellow
  "#ec4899"  // Pink
];

export default function CategoryModal({ open, onClose, category, onCategorySaved, onCategoryCreated }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#004e98");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCallback = onCategorySaved || onCategoryCreated;

  useEffect(() => {
    if (open) {
      if (category) {
        setName(category.name || "");
        setColor(category.color || "#004e98");
      } else {
        setName("");
        setColor("#004e98");
      }
      setError("");
    }
  }, [open, category]);

  const submitCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setLoading(true);
      setError("");

      const payload = {
        name: name.trim(),
        color: color
      };

      if (category && category.id) {
        // Edit mode
        await api.put(`/categories/${category.id}`, payload);
      } else {
        // Create mode
        await api.post("/categories", payload);
      }

      if (handleCallback) {
        handleCallback();
      }
      onClose();
    } catch (err) {
      console.error("Error saving category:", err);
      setError(err.response?.data?.message || "Failed to save category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{category ? "Edit Category" : "New Category"}</h2>
            <p className="modal-subtitle">
              {category 
                ? "Modify organizational group properties" 
                : "Create a new structural group for tasks"}
            </p>
          </div>
          <button onClick={onClose} className="close-btn" aria-label="Close modal">
            <FaTimes />
          </button>
        </div>

        {error && (
          <div className="settings-banner error-banner" style={{ margin: "0 24px 12px" }}>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={submitCategory} className="modal-form">
          <div className="form-group">
            <label className="form-label">Category Name</label>
            <input
              type="text"
              placeholder="e.g. Work, Personal, Marketing"
              className="form-input text-title-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category Color</label>
            <div className="color-presets-grid" style={{ display: "flex", gap: "10px", flexWrap: "wrap", margin: "8px 0" }}>
              {PRESET_COLORS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  aria-label={`Select color ${preset}`}
                  title={`Color ${preset}`}
                  className={`color-preset-dot ${color === preset ? "active" : ""}`}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: preset,
                    border: color === preset ? "3px solid var(--text-primary)" : "1px solid var(--border-default)",
                    boxShadow: color === preset ? "0 0 8px rgba(0, 0, 0, 0.2)" : "none",
                    cursor: "pointer",
                    transition: "transform 0.15s ease, border-width 0.15s ease",
                    transform: color === preset ? "scale(1.1)" : "scale(1)"
                  }}
                  onClick={() => setColor(preset)}
                  disabled={loading}
                />
              ))}
            </div>
          </div>

          <div className="modal-actions-footer">
            <button 
              type="button" 
              className="cancel-action-btn" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="save-action-btn"
              disabled={loading}
            >
              {loading ? "Saving..." : category ? "Save Changes" : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
