import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import { useUser } from "../contexts/UserContext";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaExclamationCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaTasks,
} from "react-icons/fa";
// import registerIllustration from "../assets/register_illustration.png";
import "../styles/auth.css";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useUser();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Real-time error flushing
  const handleInputChange = (field, val) => {
    if (error) setError("");
    setForm((prev) => ({ ...prev, [field]: val }));
  };

  /* ── Password Strength Validation Logic ── */
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: "", color: "transparent" };

    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { score, label: "Weak", color: "#ef4444" }; // Red
    if (score <= 3) return { score, label: "Medium", color: "#eab308" }; // Yellow
    return { score, label: "Strong", color: "#22c55e" }; // Green
  };

  const strength = getPasswordStrength(form.password);

  /* ── Password Match Logic ── */
  const passwordsMatch =
    form.password && form.password === form.confirmPassword;
  const showMatchStatus = form.confirmPassword.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.username.trim() || !form.email.trim() || !form.password) {
      setError("All fields are required.");
      return;
    }

    if (strength.score < 2) {
      setError("Please choose a stronger password.");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match. Please verify your typing.");
      return;
    }

    try {
      setLoading(true);

      const res = await register({
        username: form.username.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      if (res && res.token) {
        localStorage.setItem("token", res.token);
        login(res);
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Registration failed. Please check your inputs and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Left Side: Illustration Panel */}
        <div className="auth-illustration">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", maxWidth: "350px" }}>
            <FaTasks style={{ fontSize: "120px", color: "rgba(255,255,255,0.3)" }} />
          </div>
          <div className="auth-brand">
            <h2>TodoFlow</h2>
            <p>Your productivity, elevated.</p>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h2>Create Account</h2>
            <p>Sign up to start managing your tasks</p>
          </div>

          {error && (
            <div className="auth-error-banner">
              <FaExclamationCircle />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="actual-form-flow">
            {/* Username Input Field */}
            <div className="auth-input-group">
              <label className="auth-input-label">Username</label>
              <div className="input-with-icon-wrapper">
                <FaUser className="input-addon-icon" />
                <input
                  type="text"
                  placeholder="Choose a unique username"
                  className="auth-text-input"
                  value={form.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Email Input Field */}
            <div className="auth-input-group">
              <label className="auth-input-label">Email Address</label>
              <div className="input-with-icon-wrapper">
                <FaEnvelope className="input-addon-icon" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="auth-text-input"
                  value={form.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Password Input Field */}
            <div className="auth-input-group">
              <label className="auth-input-label">Password</label>
              <div className="input-with-icon-wrapper">
                <FaLock className="input-addon-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className="auth-text-input password-field"
                  value={form.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-visibility-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Inline Password Strength Bar Indicators */}
              {form.password && (
                <div
                  className="pwd-strength-container"
                  style={{ marginTop: "6px" }}
                >
                  <div className="pwd-strength-bar-track">
                    <div
                      className="pwd-strength-bar-fill"
                      style={{
                        width: `${(strength.score / 4) * 100}%`,
                        backgroundColor: strength.color,
                      }}
                    />
                  </div>
                  <span
                    className="pwd-strength-label"
                    style={{
                      color: strength.color,
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    Password Strength: {strength.label}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password Input Field */}
            <div className="auth-input-group">
              <label className="auth-input-label">Confirm Password</label>
              <div className="input-with-icon-wrapper">
                <FaLock className="input-addon-icon" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="auth-text-input password-field"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-visibility-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex="-1"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Inline Password Match Badges */}
              {showMatchStatus && (
                <div
                  className="pwd-match-badge"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "12px",
                    fontWeight: "500",
                    color: passwordsMatch ? "#22c55e" : "#ef4444",
                    marginTop: "6px",
                  }}
                >
                  {passwordsMatch ? (
                    <>
                      <FaCheckCircle /> <span>Passwords match</span>
                    </>
                  ) : (
                    <>
                      <FaTimesCircle /> <span>Passwords do not match</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Form Submission Systems */}
            <button
              className="auth-submit-btn"
              type="submit"
              disabled={
                loading ||
                (form.password && strength.score < 2) ||
                (showMatchStatus && !passwordsMatch)
              }
            >
              {loading ? (
                <div className="auth-btn-spinner-flow">
                  <div className="spinner-dot"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="switch-auth-link">
            Already have an account?
            <Link to="/login" className="premium-accent-link">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
