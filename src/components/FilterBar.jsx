import { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

export default function FilterBar({
  status,
  priority,
  onStatusChange,
  onPriorityChange,
  onClear
}) {
  const [statusOpen, setStatusOpen] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);

  const statusRef = useRef(null);
  const priorityRef = useRef(null);

  // Mapped exactly to match your existing backend/state values
  const statusOptions = [
    { value: "ALL", label: "All Statuses" },
    { value: "TODO", label: "To Do" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "COMPLETED", label: "Completed" },
  ];

  const priorityOptions = [
    { value: "ALL", label: "All Priorities" },
    { value: "LOW", label: "Low" },
    { value: "MEDIUM", label: "Medium" },
    { value: "HIGH", label: "High" },
  ];

  // Derive readable labels for the trigger button text
  const currentStatusLabel = statusOptions.find((o) => o.value === status)?.label || status;
  const currentPriorityLabel = priorityOptions.find((o) => o.value === priority)?.label || priority;

  // Closes dropdowns automatically when clicking elsewhere on the screen
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (statusRef.current && !statusRef.current.contains(e.target)) {
        setStatusOpen(false);
      }
      if (priorityRef.current && !priorityRef.current.contains(e.target)) {
        setPriorityOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="filter-bar">
      
      {/* Status Filter */}
      <div className="custom-select-wrapper" ref={statusRef}>
        <button
          type="button"
          className={`custom-select-trigger ${status !== "ALL" ? "active" : ""}`}
          onClick={() => {
            setStatusOpen(!statusOpen);
            setPriorityOpen(false);
          }}
        >
          <span>{currentStatusLabel}</span>
          <FaChevronDown className={`arrow-icon ${statusOpen ? "rotated" : ""}`} />
        </button>

        {statusOpen && (
          <ul className="custom-select-dropdown">
            {statusOptions.map((opt) => (
              <li
                key={opt.value}
                className={`custom-select-option ${status === opt.value ? "selected" : ""}`}
                onClick={() => {
                  onStatusChange(opt.value);
                  setStatusOpen(false);
                }}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Priority Filter */}
      <div className="custom-select-wrapper" ref={priorityRef}>
        <button
          type="button"
          className={`custom-select-trigger ${priority !== "ALL" ? "active" : ""}`}
          onClick={() => {
            setPriorityOpen(!priorityOpen);
            setStatusOpen(false);
          }}
        >
          <span>{currentPriorityLabel}</span>
          <FaChevronDown className={`arrow-icon ${priorityOpen ? "rotated" : ""}`} />
        </button>

        {priorityOpen && (
          <ul className="custom-select-dropdown">
            {priorityOptions.map((opt) => (
              <li
                key={opt.value}
                className={`custom-select-option ${priority === opt.value ? "selected" : ""}`}
                onClick={() => {
                  onPriorityChange(opt.value);
                  setPriorityOpen(false);
                }}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Clear Filters Button */}
      <button type="button" className="clear-btn" onClick={onClear}>
        Clear Filters
      </button>
    </div>
  );
}