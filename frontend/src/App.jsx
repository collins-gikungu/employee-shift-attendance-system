import React, { createContext, useState, useEffect } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { jwtDecode } from "jwt-decode";
import EmployeesPage from "./pages/EmployeesPage";
import ShiftsPage from "./pages/ShiftsPage";
import AttendancePage from "./pages/AttendancePage";
import PayrollPage from "./pages/PayrollPage";
import AdminPanelPage from "./pages/AdminPanelPage";

// Contexts
export const AuthContext = createContext();
export const ThemeContext = createContext();

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    if (decoded.exp && decoded.exp < now) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }
    return children;
  } catch (err) {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
};

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  const login = (token, userData) => {
    setCurrentUser(userData);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Apply theme to body
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <AuthContext.Provider value={{ currentUser, login, logout }}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/employees" 
              element={
                <ProtectedRoute>
                  <EmployeesPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/shifts" 
              element={
               <ProtectedRoute>
                 <ShiftsPage />
                </ProtectedRoute>
               } 
            />
            <Route 
              path="/attendance" 
              element={
               <ProtectedRoute>
                <AttendancePage />
               </ProtectedRoute>
             }
            />
            <Route 
             path="/payroll"
             element={
              <ProtectedRoute>
                <PayrollPage />
              </ProtectedRoute>
            } 
            />
            <Route
             path="/admin"
             element={
              <ProtectedRoute>
               <AdminPanelPage />
              </ProtectedRoute>
             }
             />

            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}

export default App;
