import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "./contexts/UserContext";

import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Categories from "./pages/Categories";
import CategoryDetails from "./pages/CategoryDetails";
import Settings from "./pages/Settings";
import Calendar from "./pages/Calendar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectesRoute"; // Keeping your exact filename typo intact
import Layout from "./layouts/Layout";
import { Analytics } from "@vercel/analytics/react";

function App() {
  const { user, loading } = useUser();
  const hasToken = !!localStorage.getItem("token");

  const isAuthenticated = !!user && hasToken;

  if (loading) {
    return (
      <div className="settings-loading-viewport">
        <div className="spinner-dot"></div>
        <p>Initializing application components...</p>
      </div>
    );
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Root Route Handle */}
          <Route
            path="/"
            element={
              <Navigate
                to={isAuthenticated ? "/dashboard" : "/login"}
                replace
              />
            }
          />

          {/* Public Authentication Pages (Redirect straight to dashboard if already logged in) */}
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Register />
              )
            }
          />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/categories/:id" element={<CategoryDetails />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/calendar" element={<Calendar />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Analytics />
    </>
  );
}

export default App;
