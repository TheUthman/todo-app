/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useMemo, useCallback } from "react";
import Topbar from "../components/Topbar";
import EmptyState from "../components/EmptyState";
import EditTaskModal from "../components/EditTaskModal";
import { FaChevronLeft, FaChevronRight, FaCalendarAlt, FaCheckCircle, FaExclamationCircle, FaClock } from "react-icons/fa";
import api from "../api";
import "../styles/calendar.css";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const PRIORITY_COLORS = {
  HIGH: { bg: "var(--danger-soft)", text: "var(--danger)", dot: "var(--danger)" },
  MEDIUM: { bg: "var(--warning-soft)", text: "var(--warning)", dot: "var(--warning)" },
  LOW: { bg: "var(--success-soft)", text: "var(--success)", dot: "var(--success)" },
};

export default function Calendar() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/tasks");
      setTasks(res.data || []);
    } catch (err) {
      console.error("Failed to fetch tasks for calendar:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handlePrevMonth = () => {
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const handleGoToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
  };

  const handleTaskClick = (task) => {
    setTaskToEdit(task);
    setShowEditModal(true);
  };

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      cells.push({
        day: daysInPrevMonth - i,
        currentMonth: false,
        date: new Date(year, month - 1, daysInPrevMonth - i),
      });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({
        day: d,
        currentMonth: true,
        date: new Date(year, month, d),
      });
    }

    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
      cells.push({
        day: d,
        currentMonth: false,
        date: new Date(year, month + 1, d),
      });
    }

    return cells;
  }, [currentDate]);

  const tasksByDate = useMemo(() => {
    const map = {};
    tasks.forEach((task) => {
      if (!task.dueDate && !task.due_date) return;
      const raw = task.dueDate || task.due_date;
      const key = raw.slice(0, 10);
      if (!map[key]) map[key] = [];
      map[key].push(task);
    });
    return map;
  }, [tasks]);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const toKey = useCallback((date) => {
    if (!date) return null;
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.toISOString().slice(0, 10);
  }, []);

  const selectedKey = useMemo(() => toKey(selectedDate), [selectedDate, toKey]);
  const selectedTasks = useMemo(() => (selectedKey ? tasksByDate[selectedKey] || [] : []), [selectedKey, tasksByDate]);

  const monthStats = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    let withDue = 0, overdue = 0, upcoming = 0, doneThisMonth = 0;

    tasks.forEach((task) => {
      const raw = task.dueDate || task.due_date;
      if (!raw) return;
      const d = new Date(raw);
      if (d.getFullYear() === year && d.getMonth() === month) {
        withDue++;
        if (task.status === "COMPLETED") doneThisMonth++;
        else if (d < today) overdue++;
        else upcoming++;
      }
    });
    return { withDue, overdue, upcoming, doneThisMonth };
  }, [tasks, currentDate, today]);

  return (
    <div className="calendar-page">
      <Topbar
        title="Calendar"
        subtitle="Visualize task due dates across the month"
      />

      <div className="calendar-content">
        {/* Metric Cards Grid */}
        <div className="cal-stats-row">
          <div className="cal-stat">
            <div className="cal-stat-icon-wrapper"><FaCalendarAlt /></div>
            <div>
              <span className="cal-stat-value">{monthStats.withDue}</span>
              <span className="cal-stat-label">Due this month</span>
            </div>
          </div>
          <div className="cal-stat cal-stat--overdue">
            <div className="cal-stat-icon-wrapper"><FaExclamationCircle /></div>
            <div>
              <span className="cal-stat-value">{monthStats.overdue}</span>
              <span className="cal-stat-label">Overdue</span>
            </div>
          </div>
          <div className="cal-stat cal-stat--upcoming">
            <div className="cal-stat-icon-wrapper"><FaClock /></div>
            <div>
              <span className="cal-stat-value">{monthStats.upcoming}</span>
              <span className="cal-stat-label">Upcoming</span>
            </div>
          </div>
          <div className="cal-stat cal-stat--done">
            <div className="cal-stat-icon-wrapper"><FaCheckCircle /></div>
            <div>
              <span className="cal-stat-value">{monthStats.doneThisMonth}</span>
              <span className="cal-stat-label">Completed</span>
            </div>
          </div>
        </div>

        <div className="calendar-layout">
          {/* Main Calendar View */}
          <div className="calendar-panel">
            <div className="cal-header">
              <div className="cal-header-center">
                <h2 className="cal-month-title">
                  {MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <button className="cal-today-btn" onClick={handleGoToToday}>
                  Today
                </button>
              </div>
              <div className="cal-nav-group">
                <button className="cal-nav-btn" onClick={handlePrevMonth} title="Previous month">
                  <FaChevronLeft />
                </button>
                <button className="cal-nav-btn" onClick={handleNextMonth} title="Next month">
                  <FaChevronRight />
                </button>
              </div>
            </div>

            <div className="cal-day-labels">
              {DAYS_OF_WEEK.map((d) => (
                <div key={d} className="cal-day-label">{d}</div>
              ))}
            </div>

            {loading ? (
              <div className="cal-loading">
                <div className="loading-spinner"></div>
                <p>Loading tasks...</p>
              </div>
            ) : (
              <div className="cal-grid">
                {calendarDays.map(({ day, currentMonth, date }) => {
                  const key = toKey(date);
                  const dayTasks = tasksByDate[key] || [];
                  const isToday = key === toKey(today);
                  const isSelected = selectedKey === key;
                  const isPast = date < today && currentMonth;

                  return (
                    <div
                      key={key}
                      className={[
                        "cal-cell",
                        !currentMonth && "cal-cell--other-month",
                        isToday && "cal-cell--today",
                        isSelected && "cal-cell--selected",
                        isPast && dayTasks.some((t) => t.status !== "COMPLETED") && "cal-cell--has-overdue",
                      ].filter(Boolean).join(" ")}
                      onClick={() => handleDayClick(date)}
                    >
                      <span className="cal-cell-day">{day}</span>
                      <div className="cal-cell-tasks">
                        {dayTasks.slice(0, 3).map((task) => {
                          const p = task.priority || "MEDIUM";
                          const colors = PRIORITY_COLORS[p] || PRIORITY_COLORS.MEDIUM;
                          return (
                            <div
                              key={task.id}
                              className={`cal-task-pill ${task.status === "COMPLETED" ? "cal-task-pill--done" : ""}`}
                              style={{ backgroundColor: colors.bg, color: colors.text }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTaskClick(task);
                              }}
                              title={task.title}
                            >
                              <span className="cal-task-dot" style={{ backgroundColor: colors.dot }} />
                              <span className="cal-task-name">{task.title}</span>
                            </div>
                          );
                        })}
                        {dayTasks.length > 3 && (
                          <div className="cal-task-overflow">
                            +{dayTasks.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Sidebar Detail Panel */}
          <div className="cal-detail-panel">
            {selectedDate ? (
              <>
                <div className="cal-detail-header">
                  <FaCalendarAlt className="cal-detail-icon" />
                  <div>
                    <h3 className="cal-detail-date">
                      {selectedDate.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </h3>
                    <p className="cal-detail-count">
                      {selectedTasks.length === 0
                        ? "No tasks due"
                        : `${selectedTasks.length} task${selectedTasks.length !== 1 ? "s" : ""} scheduled`}
                    </p>
                  </div>
                </div>

                {selectedTasks.length === 0 ? (
                  <div className="cal-detail-empty">
                    <EmptyState message="No tasks due on this date." />
                  </div>
                ) : (
                  <div className="cal-detail-tasks">
                    {selectedTasks.map((task) => {
                      const p = task.priority || "MEDIUM";
                      const colors = PRIORITY_COLORS[p] || PRIORITY_COLORS.MEDIUM;
                      const isOverdue = task.status !== "COMPLETED" && new Date(task.dueDate || task.due_date) < today;
                      return (
                        <div
                          key={task.id}
                          className={`cal-detail-task-card ${task.status === "COMPLETED" ? "cal-detail-task--done" : ""} ${isOverdue ? "cal-detail-task--overdue" : ""}`}
                          onClick={() => handleTaskClick(task)}
                        >
                          <div className="cal-detail-task-header">
                            <span className="cal-detail-priority-badge" style={{ backgroundColor: colors.bg, color: colors.text }}>
                              {p.toLowerCase()}
                            </span>
                            {task.status === "COMPLETED" && <span className="cal-detail-done-badge">Completed</span>}
                            {isOverdue && <span className="cal-detail-overdue-badge">Overdue</span>}
                          </div>
                          <h4 className="cal-detail-task-title">{task.title}</h4>
                          {task.description && <p className="cal-detail-task-desc">{task.description}</p>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <div className="cal-detail-placeholder">
                <FaCalendarAlt className="cal-detail-placeholder-icon" />
                <p>Select a calendar day to reveal its deep task insights.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <EditTaskModal
        open={showEditModal}
        task={taskToEdit}
        onClose={() => {
          setShowEditModal(false);
          setTaskToEdit(null);
        }}
        onTaskUpdated={loadTasks}
      />
    </div>
  );
}