/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import api from "../api";
import "../styles/modal.css";

const PRESET_COLORS = [
  "#0f766e",
  "#2563eb",
  "#16a34a",
  "#b7791f",
  "#7c3aed",
  "#dc2626",
  "#475569",
  "#be185d"
];

export default function CategoryModal({ open, onClose, category, onCategorySaved, onCategoryCreated }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#0f766e");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCallback = onCategorySaved || onCategoryCreated;

  useEffect(() => {
    if (open) {
      if (category) {
        setName(category.name || "");
        setColor(category.color || "#0f766e");
      } else {
        setName("");
        setColor("#0f766e");
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
                    boxShadow: color === preset ? "0 0 0 3px var(--bg-main)" : "none",
                    cursor: "pointer",
                    transition: "border-width 0.15s ease, box-shadow 0.15s ease"
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
