import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    console.log("AuthContext: Checking saved user", savedUser);
    
    if (savedUser && token) {
      try {
        const userData = JSON.parse(savedUser);
        console.log("AuthContext: Setting user", userData);
        setUser(userData);
      } catch (error) {
        console.error("AuthContext: Error parsing saved user:", error);
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    console.log("AuthContext: Logging in user", userData);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    
    // Redirect based on role
    if (userData.role === 'patient') {
      navigate("/patient-dashboard");
    } else if (userData.role === 'researcher') {
      navigate("/researcher-dashboard");
    } else {
      navigate("/");
    }
  };

  const logout = () => {
    console.log("AuthContext: Logging out");
    localStorage.clear();
    setUser(null);
    navigate("/");
  };

  // Add a function to check if user is authenticated
  const isAuthenticated = () => {
    return !!(user && localStorage.getItem("token"));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading,
      isAuthenticated 
    }}>
      {children}
    </AuthContext.Provider>
  );
};  