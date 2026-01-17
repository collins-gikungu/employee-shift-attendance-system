// src/services/AuthService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });
    
    if (!response.data.token) {
      throw new Error("No authentication token received");
    }

    return {
      token: response.data.token,
      user: response.data.user || {
        id: response.data.userId,
        email: response.data.email,
        role: response.data.role
      }
    };
  } catch (error) {
    console.error("AuthService login error:", error.response?.data || error.message);
    throw error.response?.data?.message || "Login failed. Please check your credentials.";
  }
};

const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    
    if (!response.data.token) {
      throw new Error("No authentication token received");
    }

    return {
      token: response.data.token,
      user: response.data.user
    };
  } catch (error) {
    console.error("AuthService register error:", error.response?.data || error.message);
    throw error.response?.data?.message || "Registration failed. Please try again.";
  }
};

const logout = () => {
  // Clear both storage locations for thoroughness
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
  return Promise.resolve();
};

const getCurrentUser = () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

const AuthService = {
  login,
  register,
  logout,
  getCurrentUser,
  isAuthenticated: () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      return decoded.exp > Date.now() / 1000;
    } catch (error) {
      return false;
    }
  }
};

export default AuthService;