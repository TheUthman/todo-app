import api from "../api";

export const getTasks = () =>
  api.get("/tasks");

export const createTask = (task) =>
  api.post("/tasks", task);

export const deleteTask = (id) =>
  api.delete(`/tasks/${id}`);

export const updateTask = (id, task) =>
  api.put(`/tasks/${id}`, task);

export const searchTasks = (keyword) =>
  api.get(`/tasks/search?keyword=${keyword}`);

export const getTasksByPriority = (priority) =>
  api.get(`/tasks/priority/${priority}`);

export const getTasksByStatus = (status) =>
  api.get(`/tasks/status/${status}`);