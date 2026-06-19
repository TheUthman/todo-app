/* eslint-disable no-unused-vars */
import axios from "axios";

// Real axios instance (used in production)
const apiUrl = (import.meta.env.VITE_API_URL || "http://localhost:8080").replace(/\/$/, "");
const baseURL = apiUrl.endsWith("/api") ? apiUrl : `${apiUrl}/api`;

const axiosApi = axios.create({
  baseURL,
});

axiosApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Dev-only in-memory mock API (no extra deps).
// Enabled when Vite reports dev mode.
let api;
if (import.meta.env && import.meta.env.DEV) {
  const mock = (() => {
    let users = [];
    let categories = [
      { id: "1", name: "Personal" },
      { id: "2", name: "Work" },
      { id: "3", name: "Shopping" },
    ];
    let tasks = [];

    const ensureAuth = (url) => {
      if (url.startsWith("/auth/")) return true;
      return !!localStorage.getItem("token");
    };

    const ok = (data) => Promise.resolve({ data });
    const err = (status = 403, message = "Forbidden") =>
      Promise.reject({ response: { status, data: { message } } });

    return {
      interceptors: { request: { use: () => {} } },
      get: (url) => {
        const [path, query] = url.split("?");

        if (!ensureAuth(path)) return err(401, "Unauthorized");

        if (path === "/dashboard") {
          const total = tasks.length;
          const completed = tasks.filter((t) => t.status === "COMPLETED").length;
          const pending = tasks.filter((t) => t.status !== "COMPLETED").length;
          return ok({
            totalTasks: total,
            completedTasks: completed,
            pendingTasks: pending,
            overdueTasks: 0,
            completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
          });
        }

        if (path === "/categories") {
          return ok(categories);
        }

        if (path.startsWith("/categories/")) {
          const catId = path.split("/").pop();
          const category = categories.find((c) => c.id === catId);
          return category ? ok(category) : err(404, "Category not found");
        }

        if (path.startsWith("/tasks/category/")) {
          const catId = path.split("/").pop();
          return ok(tasks.filter((t) => t.categoryId === catId));
        }

        if (path === "/tasks") {
          return ok([...tasks]);
        }

        if (path.startsWith("/tasks/search")) {
          const params = new URLSearchParams(query || "");
          const keyword = (params.get("keyword") || "").toLowerCase();
          const result = tasks.filter(
            (t) =>
              t.title.toLowerCase().includes(keyword) ||
              (t.description || "").toLowerCase().includes(keyword),
          );
          return ok(result);
        }

        if (path.startsWith("/tasks/priority/")) {
          const pr = path.split("/").pop();
          return ok(tasks.filter((t) => t.priority === pr));
        }

        if (path.startsWith("/tasks/status/")) {
          const st = path.split("/").pop();
          return ok(tasks.filter((t) => t.status === st));
        }

        return ok({});
      },

      post: (url, data) => {
        if (url === "/auth/login") {
          const { username } = data || {};
          if (!username) return err(400, "Missing username");
          const token = `MOCK_TOKEN_${username}`;

          let existingUser = users.find((u) => u.username === username);
          if (!existingUser) {
            existingUser = {
              id: String(users.length + 1),
              username,
              email: `${username}@example.com`,
            };
            users.push(existingUser);
          }
          return ok({ token, user: existingUser });
        }

        if (url === "/auth/register") {
          const { username, email } = data || {};
          if (!username) return err(400, "Missing username");
          const token = `MOCK_TOKEN_${username}`;
          const newUser = {
            id: String(users.length + 1),
            username,
            email: email || `${username}@example.com`,
          };
          users.push(newUser);
          return ok({ token, user: newUser });
        }

        if (!localStorage.getItem("token")) return err(401, "Unauthorized");

        if (url === "/tasks") {
          const id = String(Date.now());
          const created = { id, ...(data || {}) };
          tasks.push(created);
          return ok(created);
        }

        return ok({});
      },

      put: (url, data) => {
        if (!localStorage.getItem("token")) return err(401, "Unauthorized");

        // ── FIXED: Mock intercept processor for user profiles ──
        if (url === "/users/profile") {
          const token = localStorage.getItem("token");
          const currentMockUser = token.replace("MOCK_TOKEN_", "");

          let userIdx = users.findIndex((u) => u.username === currentMockUser);
          if (userIdx !== -1) {
            users[userIdx] = { ...users[userIdx], ...(data || {}) };
            return ok({ user: users[userIdx] });
          }

          // Dynamic fallback mapping context
          const updatedUser = { username: data.username, email: data.email };
          return ok({ user: updatedUser });
        }

        if (url.startsWith("/tasks/")) {
          const id = url.split("/").pop();
          const idx = tasks.findIndex((t) => t.id === id);
          if (idx === -1) return err(404, "Not found");
          tasks[idx] = { ...tasks[idx], ...(data || {}) };
          return ok(tasks[idx]);
        }
        return ok({});
      },

      delete: (url) => {
        if (!localStorage.getItem("token")) return err(401, "Unauthorized");
        if (url.startsWith("/tasks/")) {
          const id = url.split("/").pop();
          tasks = tasks.filter((t) => t.id !== id);
          return ok({ success: true });
        }
        return ok({});
      },
    };
  })();

  // Toggle switcher setup
  // api = mock; // Uncomment to toggle your isolated test sandboxes
  api = axiosApi;
} else {
  api = axiosApi;
}

export default api;
