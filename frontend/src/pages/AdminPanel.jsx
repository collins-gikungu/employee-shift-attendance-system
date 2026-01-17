// src/pages/AdminPanel.jsx
import React, { useContext, useEffect, useState } from "react";
import SidebarLayout from "../components/SidebarLayout";
import { ThemeContext } from "../App";
import axios from "axios";
import "../styles/AdminPanel.css";

const AdminPanel = () => {
  const { theme } = useContext(ThemeContext);
  const [summary, setSummary] = useState({
    totalEmployees: 0,
    totalShifts: 0,
    totalPayrolls: 0,
    todayAttendance: 0,
  });

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/dashboard-metrics", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSummary({
          totalEmployees: res.data.employees || 0,
          totalShifts: res.data.shifts || 0,
          totalPayrolls: res.data.payrolls || 0,
          todayAttendance: res.data.attendanceToday || 0,
        });
      } catch (err) {
        console.error("Failed to fetch summary metrics", err);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <SidebarLayout>
      <div className={`admin-panel ${theme}`}>
        <h2><i className="fas fa-tools"></i> Admin Panel</h2>

        <section className="admin-summary">
          <div className="summary-card"><h4>Employees</h4><p>{summary.totalEmployees}</p></div>
          <div className="summary-card"><h4>Shifts</h4><p>{summary.totalShifts}</p></div>
          <div className="summary-card"><h4>Payrolls</h4><p>{summary.totalPayrolls}</p></div>
          <div className="summary-card"><h4>Today’s Attendance</h4><p>{summary.todayAttendance}</p></div>
        </section>

        <section className="admin-actions">
          <h3>Quick Tools</h3>
          <div className="action-buttons">
            <a href="/employees" className="admin-btn"><i className="fas fa-users"></i> Manage Employees</a>
            <a href="/shifts" className="admin-btn"><i className="fas fa-calendar-alt"></i> Manage Shifts</a>
            <a href="/payroll" className="admin-btn"><i className="fas fa-file-invoice"></i> View Payroll</a>
          </div>
        </section>
      </div>
    </SidebarLayout>
  );
};

export default AdminPanel;
