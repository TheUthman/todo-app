/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import Topbar from "../components/Topbar";
import Card from "../components/Card";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaBell,
  FaMoon,
  FaSignOutAlt,
  FaEdit,
  FaCheck,
  FaTimes,
  FaExclamationCircle,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/settings.css";
import "../styles/modal.css";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, loading, login } = useUser();
  const navigate = useNavigate();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ username: "", email: "" });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [revealCurrent, setRevealCurrent] = useState(false);
  const [revealNew, setRevealNew] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        username: user.username || "",
        email: user.email || "",
      });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="settings-loading-viewport">
        <div className="spinner-dot" />
        <p>Loading your preferences...</p>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess(false);

    if (!profileForm.username.trim() || !profileForm.email.trim()) {
      setFormError("Fields cannot be left blank.");
      return;
    }

    try {
      setUpdateLoading(true);
      const res = await api.put("/users/profile", {
        username: profileForm.username.trim(),
        email: profileForm.email.trim().toLowerCase(),
      });

      if (res.data) {
        const activeToken = localStorage.getItem("token");
        const updatedUserProfile = {
          username: res.data.username || profileForm.username.trim(),
          email: res.data.email || profileForm.email.trim().toLowerCase(),
          role: res.data.role || user?.role || "USER"
        };

        login({ token: activeToken, user: updatedUserProfile });
        setFormSuccess(true);
        setIsEditingProfile(false);
      }
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to update profile settings.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setPasswordError("All fields are required.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }

    try {
      setPasswordLoading(true);

      await api.post("/users/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });

      setPasswordSuccess(true);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });

      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess(false);
      }, 2000);

    } catch (err) {
      setPasswordError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to change password. Verify your current password."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const cancelEditing = () => {
    setProfileForm({ username: user?.username || "", email: user?.email || "" });
    setFormError("");
    setIsEditingProfile(false);
  };

  return (
    <div className="page-content settings-page">
      <Topbar title="Settings" subtitle="Manage your account preferences" />

      <div className="settings-grid">
        <Card className="settings-card">
          <div className="card-header-actions">
            <h3>Profile Information</h3>
            {!isEditingProfile && (
              <button
                className="settings-text-edit-btn"
                onClick={() => { setIsEditingProfile(true); setFormSuccess(false); }}
                type="button"
              >
                <FaEdit /> Edit Profile
              </button>
            )}
          </div>

          {formError && (
            <div className="settings-banner error-banner">
              <FaExclamationCircle /> <span>{formError}</span>
            </div>
          )}

          {formSuccess && (
            <div className="settings-banner success-banner">
              <FaCheck /> <span>Profile updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleProfileUpdate} className="settings-card-content">
            <div className="setting-item">
              <div className="setting-item-meta">
                <div className="setting-icon-frame"><FaUser /></div>
                <div className="setting-label-block">
                  <span className="setting-title">Username</span>
                  {isEditingProfile ? (
                    <input
                      type="text"
                      className="settings-inline-input"
                      value={profileForm.username}
                      onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                      disabled={updateLoading}
                      required
                    />
                  ) : (
                    <span className="setting-value">{user?.username || "Guest User"}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-item-meta">
                <div className="setting-icon-frame"><FaEnvelope /></div>
                <div className="setting-label-block">
                  <span className="setting-title">Email Address</span>
                  {isEditingProfile ? (
                    <input
                      type="email"
                      className="settings-inline-input"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      disabled={updateLoading}
                      required
                    />
                  ) : (
                    <span className="setting-value">{user?.email || "No email provided"}</span>
                  )}
                </div>
              </div>
            </div>

            {isEditingProfile && (
              <div className="profile-edit-actions">
                <button type="button" className="settings-cancel-btn" onClick={cancelEditing} disabled={updateLoading}>
                  <FaTimes /> Cancel
                </button>
                <button type="submit" className="settings-save-btn" disabled={updateLoading}>
                  <FaCheck /> {updateLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </form>
        </Card>

        <Card className="settings-card">
          <h3>Preferences</h3>
          <div className="settings-card-content">
            <div className="setting-item interactive-row">
              <div className="setting-item-meta">
                <div className="setting-icon-frame"><FaBell /></div>
                <div className="setting-label-block">
                  <span className="setting-title">Push Notifications</span>
                  <span className="setting-value">Get real-time updates on close deadlines</span>
                </div>
              </div>
              <label className="switch-toggle" htmlFor="notify-toggle">
                <input type="checkbox" id="notify-toggle" />
                <span className="switch-slider" />
              </label>
            </div>

            <div className="setting-item interactive-row">
              <div className="setting-item-meta">
                <div className="setting-icon-frame"><FaMoon /></div>
                <div className="setting-label-block">
                  <span className="setting-title">Dark Mode Theme</span>
                  <span className="setting-value">Switch application palette to dark mode</span>
                </div>
              </div>
              <label className="switch-toggle" htmlFor="darkmode-toggle">
                <input type="checkbox" id="darkmode-toggle" checked={theme === 'dark'} onChange={toggleTheme} />
                <span className="switch-slider" />
              </label>
            </div>
          </div>
        </Card>

        <Card className="settings-card">
          <h3>Security & Session</h3>
          <div className="settings-actions-stack">
            <button
              className="settings-action-btn"
              type="button"
              onClick={() => { setShowPasswordModal(true); setPasswordError(""); setPasswordSuccess(false); }}
            >
              <FaLock />
              <span>Change Password</span>
            </button>

            <button className="settings-logout-btn" onClick={handleLogout} type="button">
              <FaSignOutAlt />
              <span>Logout from Account</span>
            </button>
          </div>
        </Card>
      </div>

      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <div>
                <h2>Update Password</h2>
                <div className="modal-subtitle">Ensure your account remains safe and resilient</div>
              </div>
              <button
                className="close-btn"
                onClick={() => setShowPasswordModal(false)}
                disabled={passwordLoading}
                type="button"
              >
                <FaTimes />
              </button>
            </div>

            {passwordError && (
              <div className="settings-banner error-banner modal-banner">
                <FaExclamationCircle /> <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div className="settings-banner success-banner modal-banner">
                <FaCheck /> <span>Password updated successfully!</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="modal-form">
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <div className="modal-pwd-input-wrapper">
                  <input
                    type={revealCurrent ? "text" : "password"}
                    className="form-input"
                    placeholder="Enter current application password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    disabled={passwordLoading}
                    required
                  />
                  <button type="button" onClick={() => setRevealCurrent(!revealCurrent)} className="modal-pwd-toggle-eye">
                    {revealCurrent ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <div className="modal-pwd-input-wrapper">
                  <input
                    type={revealNew ? "text" : "password"}
                    className="form-input"
                    placeholder="Minimum 6 complex characters"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    disabled={passwordLoading}
                    required
                  />
                  <button type="button" onClick={() => setRevealNew(!revealNew)} className="modal-pwd-toggle-eye">
                    {revealNew ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Repeat new password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  disabled={passwordLoading}
                  required
                />
              </div>

              <div className="modal-actions-footer">
                <button
                  type="button"
                  className="cancel-action-btn"
                  onClick={() => setShowPasswordModal(false)}
                  disabled={passwordLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="save-action-btn"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? "Saving Changes..." : "Apply Security Reset"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
