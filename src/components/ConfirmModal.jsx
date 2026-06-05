import { FaTimes } from "react-icons/fa";
import "../styles/modal.css";

export default function ConfirmModal({
  title,
  description,
  onConfirm,
  onClose
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{title}</h2>
            {description && <p className="modal-subtitle" style={{ marginTop: "4px" }}>{description}</p>}
          </div>
          <button onClick={onClose} className="close-btn" aria-label="Close modal">
            <FaTimes />
          </button>
        </div>

        <div className="modal-form" style={{ padding: "0 24px 24px" }}>
          <div className="modal-actions-footer" style={{ borderTop: "none", paddingTop: 0 }}>
            <button 
              type="button" 
              className="cancel-action-btn" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="save-action-btn"
              style={{ 
                background: "var(--danger)", 
                boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)" 
              }}
              onClick={onConfirm}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}