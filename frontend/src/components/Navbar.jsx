import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext, ThemeContext } from "../App";
import "./Navbar.css";

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate("/login");
  };

  return (
    <nav className={`navbar ${theme}`}>
      <div className="navbar-logo">MCH Dashboard</div>
      <ul className="navbar-links">
        <li><Link to="/dashboard">Home</Link></li>
        {currentUser?.role === "admin" && (
          <>
            <li><Link to="/employees">Employees</Link></li>
            <li><Link to="/shifts">Shifts</Link></li>
            <li><Link to="/attendance">Attendance</Link></li>
            <li><Link to="/payroll">Payroll</Link></li>
            <li><Link to="/admin">Admin Panel</Link></li>
          </>
        )}
        {currentUser?.role === "employee" && (
          <>
            <li><Link to="/attendance">My Attendance</Link></li>
            <li><Link to="/shifts">My Shifts</Link></li>
          </>
        )}
        <li><button className="toggle-btn" onClick={toggleTheme}>
          {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button></li>
        <li><a href="/logout" onClick={handleLogout}>Logout</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
