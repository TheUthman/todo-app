/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Initialize the context
const UserContext = createContext(null);

// 2. Create the Provider Component
// Inside your UserContext.jsx.
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user_profile");
      // Handle instances where storage contains the literal string "undefined" or is empty
      if (!savedUser || savedUser === "undefined") return null;
      
      return JSON.parse(savedUser);
    } catch (error) {
      console.error("Error parsing user profile from localStorage:", error);
      return null; // Fallback safely to unauthenticated instead of crashing
    }
  });

  const [loading, setLoading] = useState(false);

  const login = (userData) => {
    // Make sure you save the user payload profile object when login/update is invoked!
    localStorage.setItem("token", userData.token);
    localStorage.setItem("user_profile", JSON.stringify(userData.user));
    setUser(userData.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_profile");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};