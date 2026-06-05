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

export const login = async (data) => {
  const res = await api.post("/auth/login", data);

  return res.data;
};
