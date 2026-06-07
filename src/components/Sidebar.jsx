import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaThLarge,
  FaTasks,
  FaFolder,
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
    <aside
      className="sidebar"
      style={{
        width: isCollapsed ? "80px" : "280px",
        minWidth: isCollapsed ? "80px" : "280px",
        alignItems: isCollapsed ? "center" : "start",
        padding: "32px 20px",
        borderRight: "1px solid var(--border-soft)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
      }}
    >
      <style>{`
        @keyframes flowWave {
          0% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        style={{
          position: "absolute",
          right: "-12px",
          top: "40px",
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          background: "#4f46e5",
          color: "white",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
          zIndex: 10,
        }}
      >
        {isCollapsed ? (
          <FaChevronRight size={10} />
        ) : (
          <FaChevronLeft size={10} />
        )}
      </button>

      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          alignItems: isCollapsed ? "center" : "start",
        }}
      >
        {/* Logo */}
        <div
          className="logo"
          style={{
            marginBottom: "48px",
            paddingLeft: "12px",
            justifyContent: "flex-start",
          }}
        >
          <div className="logo-icon">
            T<span>F</span>
          </div>
          {!isCollapsed && (
            <span
              className="logo-text"
              style={{ fontSize: "1.5rem", fontWeight: 800 }}
            >
              Todo<span>Flow</span>
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="sidebar-nav" style={{ flex: 1 }}>
          {!isCollapsed && (
            <span
              className="nav-section-label"
              style={{
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontWeight: 700,
                opacity: 0.5,
                marginBottom: "16px",
                display: "block",
                paddingLeft: "12px",
              }}
            >
              Menu
            </span>
          )}

          <NavLink
            to="/dashboard"
            title={isCollapsed ? "Dashboard" : ""}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            style={{
              justifyContent: "flex-start",
              padding: "14px 20px",
            }}
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
            style={{
              justifyContent: "flex-start",
              padding: "14px 20px",
            }}
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
            style={{
              justifyContent: "flex-start",
              padding: "14px 20px",
            }}
          >
            <FaFolder className="nav-icon" />
            {!isCollapsed && "Categories"}
          </NavLink>

          {!isCollapsed && (
            <span
              className="nav-section-label"
              style={{
                display: "block",
                paddingLeft: "12px",
                marginTop: "24px",
                marginBottom: "16px",
                fontSize: "0.75rem",
                fontWeight: 700,
                opacity: 0.5,
                textTransform: "uppercase",
              }}
            >
              Account
            </span>
          )}
          <NavLink
            to="/settings"
            title={isCollapsed ? "Settings" : ""}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            style={{
              justifyContent: "flex-start",
              padding: "14px 20px",
            }}
          >
            <FaCog className="nav-icon" />
            {!isCollapsed && "Settings"}
          </NavLink>
        </nav>
      </div>

      {/* User + Logout */}
      <div
        className="sidebar-user"
        style={{ padding: isCollapsed ? "20px 0" : "20px" }}
      >
        <div
          className="user-info"
          style={{
            justifyContent: isCollapsed ? "center" : "flex-start",
            padding: isCollapsed ? "0" : "0",
          }}
        >
          <div className="user-avatar-sm" style={{ minWidth: "40px" }}>
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
          style={{
            justifyContent: "flex-start",
          }}
        >
          <FaSignOutAlt />
          {!isCollapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
}
