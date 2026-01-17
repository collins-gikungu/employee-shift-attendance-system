// src/components/AttendanceTracker.jsx
import React, { useContext } from "react";
import { AuthContext, ThemeContext } from "../App";
import "./AttendanceTracker.css";

const AttendanceTracker = () => {
  const { currentUser } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  // ✅ Static mock attendance data
  const staticAttendance = [
    {
      id: 1,
      employee: "Collins Gikungu",
      date: "2025-04-18",
      clockIn: "14:00",
      clockOut: "19:10"
    },
    {
      id: 2,
      employee: "Michael Kimani",
      date: "2025-04-18",
      clockIn: "12:15",
      clockOut: "18:45"
    },
    {
      id: 3,
      employee: "Grace Wangui",
      date: "2025-04-18",
      clockIn: "13:00",
      clockOut: "19:10"
    },
    {
      id: 4,
      employee: "Blessing Moraa",
      date: "2025-04-18",
      clockIn: "08:55",
      clockOut: "14:30"
    },
    {
      id: 5,
      employee: "Fortune Njeri",
      date: "2025-04-18",
      clockIn: "09:55",
      clockOut: "17:10"
    },
  ];

  return (
    <div className={`attendance-tracker ${theme}`}>
      <h3><i className="fas fa-clipboard-list"></i> Attendance Records</h3>

      <div className="attendance-exports">
        <button className="export-btn" disabled>📤 Export CSV</button>
        <button className="export-btn" disabled>🧾 Export PDF</button>
      </div>

      <table className="attendance-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Employee</th>
            <th>Date</th>
            <th>Clock In</th>
            <th>Clock Out</th>
          </tr>
        </thead>
        <tbody>
          {staticAttendance.map((record, index) => (
            <tr key={record.id}>
              <td>{index + 1}</td>
              <td>{record.employee}</td>
              <td>{record.date}</td>
              <td>{record.clockIn}</td>
              <td>{record.clockOut}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTracker;
