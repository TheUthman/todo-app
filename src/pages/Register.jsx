import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authservice";
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
} from "react-icons/fa";
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
        <div
          className="auth-illustration"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div className="illustration-overlay"></div>
          <img
            src="/todoflow-mark.svg"
            alt=""
            aria-hidden="true"
            style={{
              width: "96px",
              height: "96px",
              marginBottom: "1.5rem",
              zIndex: 1,
            }}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 520"
            fill="none"
          >
            <rect
              x="138"
              y="66"
              width="364"
              height="370"
              rx="28"
              fill="#111827"
            />
            <rect
              x="162"
              y="96"
              width="316"
              height="310"
              rx="20"
              fill="#F7F4EE"
            />
            <rect
              x="190"
              y="128"
              width="132"
              height="18"
              rx="9"
              fill="#14B8A6"
            />
            <rect
              x="190"
              y="160"
              width="244"
              height="100"
              rx="18"
              fill="#FFFFFF"
              stroke="#E8E2D8"
            />
            <path
              d="M210 230L250 190L290 210L330 170L370 190L410 150"
              stroke="#14B8A6"
              stroke-width="6"
              stroke-linecap="round"
              stroke-linejoin="round"
              opacity="0.3"
            />
            <path
              d="M210 240C240 200 280 230 310 190C340 150 380 180 410 140"
              stroke="#14B8A6"
              stroke-width="6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <rect
              x="190"
              y="280"
              width="156"
              height="14"
              rx="7"
              fill="#E8E2D8"
            />
            <rect
              x="190"
              y="310"
              width="210"
              height="14"
              rx="7"
              fill="#E8E2D8"
            />
            <rect
              x="190"
              y="338"
              width="112"
              height="14"
              rx="7"
              fill="#D7D0C4"
            />
            <rect
              x="94"
              y="280"
              width="56"
              height="14"
              rx="7"
              fill="#14B8A6"
              opacity="0.9"
            />
            <rect
              x="92"
              y="304"
              width="82"
              height="14"
              rx="7"
              fill="#E8E2D8"
              opacity="0.9"
            />
            <rect
              x="488"
              y="280"
              width="58"
              height="14"
              rx="7"
              fill="#14B8A6"
              opacity="0.9"
            />
            <rect
              x="462"
              y="304"
              width="84"
              height="14"
              rx="7"
              fill="#E8E2D8"
              opacity="0.9"
            />
            <path
              d="M120 130C145 150 168 148 194 136"
              stroke="#14B8A6"
              stroke-width="10"
              stroke-linecap="round"
            />
            <path
              d="M438 138C456 148 477 152 502 142"
              stroke="#14B8A6"
              stroke-width="10"
              stroke-linecap="round"
            />
            <circle
              cx="108"
              cy="128"
              r="12"
              fill="#CCFBF1"
              stroke="#14B8A6"
              stroke-width="4"
            />
            <circle
              cx="516"
              cy="140"
              r="12"
              fill="#CCFBF1"
              stroke="#14B8A6"
              stroke-width="4"
            />
            <path
              d="M286 52C286 40.9543 294.954 32 306 32H334C345.046 32 354 40.9543 354 52V84H286V52Z"
              fill="#111827"
            />
            <circle cx="320" cy="58" r="8" fill="#14B8A6" />
          </svg>
          <div
            className="auth-brand"
            style={{ textAlign: "center", zIndex: 1, marginTop: "2rem" }}
          >
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: "800",
                color: "white",
                marginBottom: "0.5rem",
              }}
            >
              TodoFlow
            </h2>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1.1rem" }}>
              Your productivity, elevated.
            </p>
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
