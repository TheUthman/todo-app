import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export default function ProtectedRoute() {
  const { user, loading } = useUser();
  const token = localStorage.getItem("token");

  // 1. Hold the render gate open while UserContext handles initialization
  if (loading) {
    return (
      <div className="settings-loading-viewport">
        <div className="spinner-dot"></div>
        <p>Authenticating your session...</p>
      </div>
    );
  }

  // 2. Strict Fallback: Kick out if token is missing or if profile payload is empty
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Render child sub-routes cleanly
  return <Outlet />;
}