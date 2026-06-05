import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as apiLogin } from "../services/authService";
import { useUser } from "../contexts/UserContext";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaExclamationCircle } from "react-icons/fa";
import loginIllustration from "../assets/login_illustration.png";
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
      role: res.role
    };

    // 3. Save the string token cleanly to disk
    localStorage.setItem("token", token);
    
    // 4. Update the UserContext with the perfectly mapped nested layout payload
    login({ 
      token: token, 
      user: userProfile 
    }); 

    // 5. Navigate cleanly to your workspace
    navigate("/dashboard");

  } catch (err) {
    console.error("Login Error details:", err);
    setError(
      err.response?.data?.message || 
      err.response?.data?.error || 
      "Invalid username or password. Please try again."
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
          <div className="illustration-overlay"></div>
          <img
            src={loginIllustration}
            alt="Login illustration"
            className="floating-artwork"
          />
          <div className="auth-brand">
            <h2>TodoFlow</h2>
            <p>Stay organized, stay ahead.</p>
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
                  onChange={(e) => handleInputChange("username", e.target.value)}
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
                  onChange={(e) => handleInputChange("password", e.target.value)}
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
            <Link to="/register" className="premium-accent-link">Register here</Link>
          </p>
        </div>

      </div>
    </div>
  );
}