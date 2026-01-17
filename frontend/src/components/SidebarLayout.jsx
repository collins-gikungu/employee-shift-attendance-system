// src/components/SidebarLayout.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SidebarLayout.css";
import { jwtDecode } from "jwt-decode";

const SidebarLayout = ({ children }) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({ role: "", name: "", email: "" });

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserInfo({
          role: decoded.role || "employee",
          name: decoded.name || "",
          email: decoded.email || "",
        });
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="main-layout">
      <aside className="sidebar">
        <div className="sidebar-title">MCH</div>

        {/* 👤 Avatar + User Info */}
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            <i className="fas fa-user-circle"></i>
          </div>
          <div className="user-name">{userInfo.name || userInfo.email?.split("@")[0]}</div>
          <div className="user-role">{userInfo.role}</div>
        </div>

        {/* 📌 Navigation Links */}
        <nav className="sidebar-nav">
          <Link to="/dashboard"><i className="fas fa-home"></i> Dashboard</Link>

          {userInfo.role === "admin" ? (
            <>
              <Link to="/employees"><i className="fas fa-users"></i> Employees</Link>
              <Link to="/shifts"><i className="fas fa-calendar-alt"></i> Shifts</Link>
              <Link to="/attendance"><i className="fas fa-clipboard-list"></i> Attendance</Link>
              <Link to="/payroll"><i className="fas fa-file-invoice-dollar"></i> Payroll</Link>
              <Link to="/admin"><i className="fas fa-user-shield"></i> Admin Panel</Link>
            </>
          ) : (
            <>
              <Link to="/attendance"><i className="fas fa-calendar-check"></i> My Attendance</Link>
              <Link to="/shifts"><i className="fas fa-clock"></i> My Shifts</Link>
            </>
          )}

          <a href="/logout" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Logout</a>
        </nav>
      </aside>

      <main className="main-content">{children}</main>
    </div>
  );
};

export default SidebarLayout;
