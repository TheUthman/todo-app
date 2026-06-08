import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaThLarge,
  FaTasks,
  FaFolder,
  FaCalendarAlt,
  FaCog,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import "../styles/sidebar.css";
import { useUser } from "../contexts/UserContext";

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const username = user?.username || "User";
  const initial = username.charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className={`sidebar ${isCollapsed ? "is-collapsed" : ""}`}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="sidebar-collapse-btn"
      >
        {isCollapsed ? (
          <FaChevronRight size={10} />
        ) : (
          <FaChevronLeft size={10} />
        )}
      </button>

      <div className="sidebar-main">
        <div className="logo">
          <div className="logo-icon">
            <img src="/todoflow-mark.svg" alt="" aria-hidden="true" />
          </div>
          {!isCollapsed && (
            <span
              className="logo-text"
            >
              Todo<span>Flow</span>
            </span>
          )}
        </div>

        <nav className="sidebar-nav">
          {!isCollapsed && (
            <span className="nav-section-label">
              Menu
            </span>
          )}
          
          <NavLink
            to="/dashboard"
            title={isCollapsed ? "Dashboard" : ""}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <FaThLarge className="nav-icon" />
            {!isCollapsed && "Dashboard"}
          </NavLink>

          <NavLink
            to="/tasks"
            title={isCollapsed ? "Tasks" : ""}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <FaTasks className="nav-icon" />
            {!isCollapsed && "Tasks"}
          </NavLink>

          <NavLink
            to="/categories"
            title={isCollapsed ? "Categories" : ""}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <FaFolder className="nav-icon" />
            {!isCollapsed && "Categories"}
          </NavLink>

          <NavLink
            to="/calendar"
            title={isCollapsed ? "Calendar" : ""}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <FaCalendarAlt className="nav-icon" />
            {!isCollapsed && "Calendar"}
          </NavLink>

          {!isCollapsed && (
            <span className="nav-section-label nav-section-label-account">
              Account
            </span>
          )}
          <NavLink
            to="/settings"
            title={isCollapsed ? "Settings" : ""}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <FaCog className="nav-icon" />
            {!isCollapsed && "Settings"}
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-user">
        <div className="user-info">
          <div className="user-avatar-sm">
            {initial}
          </div>
          {!isCollapsed && (
            <div className="user-meta">
              <strong>{username}</strong>
              <small>Logged in</small>
            </div>
          )}
        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
          title={isCollapsed ? "Logout" : ""}
        >
          <FaSignOutAlt />
          {!isCollapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
}
