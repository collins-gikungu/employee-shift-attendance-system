// src/components/AttendanceTracker.jsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext, ThemeContext } from "../App";
import "./AttendanceTracker.css";

const AttendanceTracker = () => {
  const { currentUser, token } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/attendance", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch attendance records");
        }

        const data = await res.json();
        setAttendance(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [token]);

  return (
    <div className={`attendance-tracker ${theme}`}>
      <h3>📋 Attendance Records</h3>

      {loading && <p>Loading attendance...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
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
            {attendance.map((record, index) => (
              <tr key={record.id}>
                <td>{index + 1}</td>
                <td>{record.employee_name}</td>
                <td>{new Date(record.date).toLocaleDateString()}</td>
                <td>
                  {record.clock_in
                    ? new Date(record.clock_in).toLocaleTimeString()
                    : "--"}
                </td>
                <td>
                  {record.clock_out
                    ? new Date(record.clock_out).toLocaleTimeString()
                    : "--"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AttendanceTracker;
