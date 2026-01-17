// src/pages/ShiftsPage.jsx
import React, { useContext } from "react";
import SidebarLayout from "../components/SidebarLayout";
import ShiftManager from "../components/ShiftManager";
import { ThemeContext } from "../App";
import "../styles/PageWrapper.css";

const ShiftsPage = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <SidebarLayout>
      <div className={`page-wrapper ${theme}`}>
        <h2><i className="fas fa-calendar-alt"></i> Shift Management</h2>
        <ShiftManager />
      </div>
    </SidebarLayout>
  );
};

export default ShiftsPage;
