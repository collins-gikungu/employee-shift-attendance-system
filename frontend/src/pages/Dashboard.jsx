// src/pages/Dashboard.jsx
import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

import SidebarLayout from "../components/SidebarLayout";
import WelcomeCard from "../components/WelcomeCard";
import MetricCards from "../components/MetricCards";
import DashboardChart from "../components/DashboardChart";
import { ThemeContext } from "../App";

import "./Dashboard.css";

const Dashboard = () => {
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");
  const [metrics, setMetrics] = useState({
    employees: 0,
    shifts: 0,
    attendanceToday: 0,
    payrolls: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const hasValidated = useRef(false);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (hasValidated.current) return;
    hasValidated.current = true;

    const validateTokenAndFetch = async () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) return navigate("/");

      try {
        const decoded = jwtDecode(token);
        if (decoded.exp && decoded.exp < Date.now() / 1000) {
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          return navigate("/");
        }

        setUserRole(decoded.role);
        const nameOrEmail = decoded.name || decoded.email?.split("@")[0] || "there";
        setUserName(nameOrEmail);

        const res = await axios.get("http://localhost:5000/api/dashboard-metrics", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMetrics(res.data);
      } catch (err) {
        console.error("Token/metrics error:", err);
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    validateTokenAndFetch();
  }, [navigate]);

  if (loading) return <div className="dashboard-loading">Loading...</div>;

  return (
    <SidebarLayout>
      <div className={`dashboard-content ${theme}`}>
        <WelcomeCard userName={userName} />

        <MetricCards
          metrics={[
            { label: "Total Employees", value: metrics.employees || 0 },
            { label: "Shifts Today", value: metrics.shifts || 0 },
            { label: "Present Employees", value: metrics.attendanceToday || 0 },
            { label: "Pending Payrolls", value: metrics.payrolls || 0 },
          ]}
        />

        <div className="dashboard-grid">
          <DashboardChart />
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Dashboard;
