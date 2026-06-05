/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaSearch, FaCog, FaSignOutAlt, FaUser } from "react-icons/fa";
import "../styles/Topbar.css";
import { useUser } from "../contexts/UserContext"; // 1. Maintain context import

export default function Topbar({ title, subtitle, onSearch }) {
  const navigate = useNavigate();
  const { user, logout } = useUser(); // 2. Extract both user data and logout function
  const [searchValue, setSearchValue] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  // 3. Cleanly derive username and initial from global state
  const username = user?.username || "User"; 
  const initial = username.charAt(0).toUpperCase();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchValue(val);
    if (onSearch) onSearch(val);
  };

  // 4. Connect the button to your global logout handler
  const handleLogout = () => {
    logout(); // Clears state AND removes storage tokens simultaneously 
    navigate("/login");
  };

  return (
    <header className="topbar-wrap">
      {/* Left: Title */}
      <div className="topbar-left">
        <h2 className="topbar-title">{title}</h2>
        {subtitle && <p className="topbar-subtitle">{subtitle}</p>}
      </div>

      {/* Right: Controls */}
      <div className="topbar-right">
        {/* Search */}
        {onSearch && (
          <div className="topbar-search">
            <FaSearch className="search-icon" />
            <input
              id="topbar-search-input"
              type="text"
              placeholder="Search..."
              className="search-input"
              value={searchValue}
              onChange={handleSearch}
            />
          </div>
        )}

        {/* Notifications */}
        <div className="topbar-notif" ref={notifRef}>
          <button
            id="topbar-notif-btn"
            className="icon-btn"
            onClick={() => {
              setNotifOpen((o) => !o);
              setDropdownOpen(false);
            }}
            aria-label="Notifications"
          >
            <FaBell />
            <span className="notif-badge">3</span>
          </button>

          {notifOpen && (
            <div className="notif-dropdown">
              <div className="notif-header">
                <span>Notifications</span>
                <button className="notif-clear">Clear all</button>
              </div>
              <ul className="notif-list">
                <li className="notif-item notif-unread">
                  <span className="notif-dot" />
                  <div>
                    <p className="notif-text">Task "Design mockup" is overdue</p>
                    <span className="notif-time">2 min ago</span>
                  </div>
                </li>
                <li className="notif-item notif-unread">
                  <span className="notif-dot" />
                  <div>
                    <p className="notif-text">3 tasks due today</p>
                    <span className="notif-time">1 hr ago</span>
                  </div>
                </li>
                <li className="notif-item">
                  <span className="notif-dot notif-dot-read" />
                  <div>
                    <p className="notif-text">Category "Dev" created</p>
                    <span className="notif-time">Yesterday</span>
                  </div>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Avatar + Dropdown */}
        <div className="topbar-user" ref={dropdownRef}>
          <button
            id="topbar-avatar-btn"
            className="user-avatar"
            onClick={() => {
              setDropdownOpen((o) => !o);
              setNotifOpen(false);
            }}
            aria-label="User menu"
            aria-expanded={dropdownOpen}
          >
            {initial}
          </button>

          {dropdownOpen && (
            <div className="user-dropdown">
              <div className="dropdown-profile">
                <div className="dropdown-avatar">{initial}</div>
                <div>
                  <strong className="dropdown-name">{username}</strong>
                  <span className="dropdown-role">Member</span>
                </div>
              </div>

              <div className="dropdown-divider" />

              <button
                className="dropdown-item"
                onClick={() => {
                  navigate("/settings");
                  setDropdownOpen(false);
                }}
              >
                <FaCog className="dropdown-icon" />
                Settings
              </button>

              <div className="dropdown-divider" />

              <button
                className="dropdown-item dropdown-item-danger"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="dropdown-icon" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}