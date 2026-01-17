// src/pages/AdminPanelPage.jsx
import React, { useEffect, useState } from "react";
import SidebarLayout from "../components/SidebarLayout";
import axios from "axios";
import "./AdminPanelPage.css";

const AdminPanelPage = () => {
  const [metrics, setMetrics] = useState({
    employees: 0,
    shifts: 0,
    attendanceToday: 0,
    payrolls: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:5000/api/dashboard-metrics", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMetrics(res.data))
      .catch((err) => console.error("Admin metrics error", err));
  }, []);

  return (
    <SidebarLayout>
      <div className="admin-panel-page">
        <h2><i className="fas fa-user-cog"></i> Admin Panel</h2>
        <p>Welcome to the Admin Control Center. Here’s your system overview:</p>

        <div className="admin-stats-grid">
          <div className="stat-card">
            <h3>{metrics.employees}</h3>
            <p>Total Employees</p>
          </div>
          <div className="stat-card">
            <h3>{metrics.shifts}</h3>
            <p>Total Shifts</p>
          </div>
          <div className="stat-card">
            <h3>{metrics.attendanceToday}</h3>
            <p>Present Today</p>
          </div>
          <div className="stat-card">
            <h3>{metrics.payrolls}</h3>
            <p>Payroll Records</p>
          </div>
        </div>

        <div className="admin-actions">
          <h4>Quick Links</h4>
          <ul className="admin-tasks">
            <li onClick={() => window.location.href = "/employees"}>
              <i className="fas fa-users-cog"></i> Manage Employees
            </li>
            <li onClick={() => window.location.href = "/shifts"}>
              <i className="fas fa-calendar-alt"></i> Manage Shifts
            </li>
            <li onClick={() => window.location.href = "/attendance"}>
              <i className="fas fa-clipboard-list"></i> View Attendance
            </li>
            <li onClick={() => window.location.href = "/payroll"}>
              <i className="fas fa-file-invoice-dollar"></i> Payroll Overview
            </li>
          </ul>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default AdminPanelPage;
