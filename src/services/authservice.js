import api from "../api";

export const register = async (data) => {
  try {
    const res = await api.post("/auth/register", data);
    return res.data;
  } catch (error) {
    console.error("Registration error:", {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data,
    });
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const res = await api.post("/auth/login", credentials);
    return res.data;
  } catch (error) {
    console.error("Login service error:", {
      status: error.response?.status,
      message:
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message,
      details: error.response?.data,
    });
    throw error;
  }
};
