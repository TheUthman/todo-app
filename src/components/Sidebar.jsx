import { NavLink, useNavigate } from "react-router-dom"; // 1. Added useNavigate
import {
  FaThLarge,
  FaTasks,
  FaFolder,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import "../styles/sidebar.css";
import { useUser } from "../contexts/UserContext";

export default function Sidebar() {
  const navigate = useNavigate(); 
  const { user, logout } = useUser();

  // 4. Derive username and initial cleanly from global state
  const username = user?.username || "User"; 
  const initial = username.charAt(0).toUpperCase();

  // 5. Connect the button to your global context logout handler
  const handleLogout = () => {
    logout(); // Clears user context + local storage cleanly
    navigate("/login"); // Smooth client-side redirect (no full-page reload)
  };

  return (
    <aside className="sidebar">
      <div>
        {/* Logo */}
        <div className="logo">
          <div className="logo-icon">T</div>
          <span className="logo-text">
            Todo<span>Flow</span>
          </span>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          <span className="nav-section-label">Menu</span>

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <FaThLarge className="nav-icon" />
            Dashboard
          </NavLink>

          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <FaTasks className="nav-icon" />
            Tasks
          </NavLink>

          <NavLink
            to="/categories"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <FaFolder className="nav-icon" />
            Categories
          </NavLink>

          <span className="nav-section-label">Account</span>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <FaCog className="nav-icon" />
            Settings
          </NavLink>
        </nav>
      </div>

      {/* User + Logout */}
      <div className="sidebar-user">
        <div className="user-info">
          <div className="user-avatar-sm">{initial}</div>
          <div className="user-meta">
            <strong>{username}</strong>
            <small>Logged in</small>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </aside>
  );
}