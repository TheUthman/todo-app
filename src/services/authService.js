import api from "../api";

/**
 * Login service - calls the auth/login endpoint
 * Returns an object with token and user data
 */
export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

/**
 * Register service - calls the auth/register endpoint
 * Returns an object with token and user data
 */
export const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

/**
 * Logout service - clears local storage
 */
export const logout = () => {
  localStorage.removeItem("token");
};

/**
 * Get current user from token
 */
export const getCurrentUser = () => {
  const token = localStorage.getItem("token");
  return token ? { token } : null;
};
