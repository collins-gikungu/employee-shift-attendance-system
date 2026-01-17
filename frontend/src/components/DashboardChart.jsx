// src/components/DashboardChart.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Line, Pie } from "react-chartjs-2";
import "./DashboardChart.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Tooltip,
  Legend
);

const DashboardChart = () => {
  const [shiftData, setShiftData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [roleData, setRoleData] = useState({});

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/dashboard-analytics", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShiftData(res.data.shiftsPerEmployee || []);
      setAttendanceData(res.data.attendanceOverTime || []);
      setRoleData(res.data.rolesDistribution || {});
    } catch (err) {
      console.error("Error fetching analytics data:", err);
    }
  };

  // Bar Chart: Shifts per Employee
  const shiftBar = {
    labels: shiftData.map(item => item.name),
    datasets: [
      {
        label: "Shifts",
        data: shiftData.map(item => item.shift_count),
        backgroundColor: "#007bff",
      },
    ],
  };

  // Line Chart: Attendance Over Time
  const attendanceLine = {
    labels: attendanceData.map(item => item.date),
    datasets: [
      {
        label: "Attendance Count",
        data: attendanceData.map(item => item.count),
        borderColor: "#28a745",
        fill: false,
      },
    ],
  };

  // Pie Chart: Roles Distribution
  const rolePie = {
    labels: Object.keys(roleData),
    datasets: [
      {
        data: Object.values(roleData),
        backgroundColor: ["#007bff", "#ffc107", "#dc3545"],
      },
    ],
  };

  return (
    <div className="dashboard-chart">
      <h3><i className="fas fa-chart-bar"></i> Dashboard Analytics</h3>
      <div className="chart-grid">
        <div className="chart-box">
          <h4>Shifts per Employee</h4>
          <Bar data={shiftBar} />
        </div>
        <div className="chart-box">
          <h4>Attendance Over Time</h4>
          <Line data={attendanceLine} />
        </div>
        <div className="chart-box">
          <h4>Employee Roles</h4>
          <Pie data={rolePie} />
        </div>
      </div>
    </div>
  );
};

export default DashboardChart;
