import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as apiLogin } from "../services/authservice";
import { useUser } from "../contexts/UserContext";
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaExclamationCircle,
} from "react-icons/fa";
import "../styles/auth.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useUser();

  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // New interactive state

  // Clean state tracking that flushes errors when modifications begin
  const handleInputChange = (field, val) => {
    if (error) setError("");
    setForm((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password) return;

    try {
      setLoading(true);
      setError("");

      const res = await apiLogin(form);

      const token = res.token;

      if (!token) {
        setError("Authentication failed: Token missing from server response.");
        return;
      }

      // 2. CRITICAL: Reconstruct the nested 'user' object structure your frontend expects
      const userProfile = {
        username: res.username,
        email: res.email,
        role: res.role,
      };

      // 3. Save the string token cleanly to disk
      localStorage.setItem("token", token);

      // 4. Update the UserContext with the perfectly mapped nested layout payload
      login({
        token: token,
        user: userProfile,
      });

      // 5. Navigate cleanly to your workspace
      navigate("/dashboard");
    } catch (err) {
      console.error("Login Error details:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Invalid username or password. Please try again.",
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
              fill="#D7D0C4"
            />
            <rect
              x="190"
              y="160"
              width="196"
              height="14"
              rx="7"
              fill="#E8E2D8"
            />
            <rect
              x="190"
              y="188"
              width="164"
              height="14"
              rx="7"
              fill="#E8E2D8"
            />
            <rect
              x="190"
              y="224"
              width="244"
              height="72"
              rx="18"
              fill="#FFFFFF"
              stroke="#E8E2D8"
            />
            <rect
              x="214"
              y="246"
              width="128"
              height="12"
              rx="6"
              fill="#D7D0C4"
            />
            <rect
              x="214"
              y="268"
              width="96"
              height="12"
              rx="6"
              fill="#E8E2D8"
            />
            <circle cx="410" cy="260" r="24" fill="#CCFBF1" />
            <path
              d="M399 259.5L407.5 268L423 251.5"
              stroke="#0F766E"
              stroke-width="6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <rect
              x="190"
              y="316"
              width="156"
              height="14"
              rx="7"
              fill="#E8E2D8"
            />
            <rect
              x="190"
              y="346"
              width="210"
              height="14"
              rx="7"
              fill="#E8E2D8"
            />
            <rect
              x="190"
              y="374"
              width="112"
              height="14"
              rx="7"
              fill="#D7D0C4"
            />
            <rect
              x="94"
              y="136"
              width="56"
              height="14"
              rx="7"
              fill="#14B8A6"
              opacity="0.9"
            />
            <rect
              x="92"
              y="160"
              width="82"
              height="14"
              rx="7"
              fill="#E8E2D8"
              opacity="0.9"
            />
            <rect
              x="488"
              y="136"
              width="58"
              height="14"
              rx="7"
              fill="#14B8A6"
              opacity="0.9"
            />
            <rect
              x="462"
              y="160"
              width="84"
              height="14"
              rx="7"
              fill="#E8E2D8"
              opacity="0.9"
            />
            <path
              d="M120 352C145 332 168 334 194 346"
              stroke="#14B8A6"
              stroke-width="10"
              stroke-linecap="round"
            />
            <path
              d="M438 344C456 334 477 330 502 340"
              stroke="#14B8A6"
              stroke-width="10"
              stroke-linecap="round"
            />
            <circle
              cx="108"
              cy="354"
              r="12"
              fill="#CCFBF1"
              stroke="#14B8A6"
              stroke-width="4"
            />
            <circle
              cx="516"
              cy="342"
              r="12"
              fill="#CCFBF1"
              stroke="#14B8A6"
              stroke-width="4"
            />
            <path
              d="M286 52C286 40.9543 294.954 32 306 32H334C345.046 32 354 40.9543 354 52V84H286V52Z"
              fill="#111827"
            />
            <path
              d="M302 56C302 49.3726 307.373 44 314 44H326C332.627 44 338 49.3726 338 56V84H302V56Z"
              fill="#14B8A6"
            />
            <path
              d="M312 66L318 72L330 58"
              stroke="#F7F4EE"
              stroke-width="5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
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
              Stay organized, stay ahead.
            </p>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h2>Welcome Back!</h2>
            <p>Sign in to continue to your workspace account</p>
          </div>

          {error && (
            <div className="auth-error-banner animate-fade-in">
              <FaExclamationCircle />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="actual-form-flow">
            {/* Username Input Group */}
            <div className="auth-input-group">
              <label className="auth-input-label">Username</label>
              <div className="input-with-icon-wrapper">
                <FaUser className="input-addon-icon" />
                <input
                  type="text"
                  placeholder="Enter your username"
                  required
                  disabled={loading}
                  className="auth-text-input"
                  value={form.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Password Input Group */}
            <div className="auth-input-group">
              <label className="auth-input-label">Password</label>
              <div className="input-with-icon-wrapper">
                <FaLock className="input-addon-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                  className="auth-text-input password-field"
                  value={form.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
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
            </div>

            {/* Submission Action Button */}
            <button
              className="auth-submit-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <div className="auth-btn-spinner-flow">
                  <div className="spinner-dot"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                "Sign In to Workspace"
              )}
            </button>
          </form>

          <p className="switch-auth-link">
            Don't have an account?{" "}
            <Link to="/register" className="premium-accent-link">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
