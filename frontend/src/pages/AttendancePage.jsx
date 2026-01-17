// src/pages/AttendancePage.jsx
import React, { useContext } from "react";
import SidebarLayout from "../components/SidebarLayout";
import AttendanceTracker from "../components/AttendanceTracker";
import { ThemeContext, AuthContext } from "../App";
import "../styles/PageWrapper.css";

const AttendancePage = () => {
  const { theme } = useContext(ThemeContext);
  const { currentUser } = useContext(AuthContext);

  return (
    <SidebarLayout>
      <div className={`page-wrapper ${theme}`}>
        <h2><i className="fas fa-clipboard-list"></i> Attendance</h2>
        <AttendanceTracker role={currentUser?.role} userId={currentUser?.id} />
      </div>
    </SidebarLayout>
  );
};

export default AttendancePage;
