// src/pages/EmployeesPage.jsx
import React, { useContext } from "react";
import SidebarLayout from "../components/SidebarLayout";
import EmployeeManager from "../components/EmployeeManager";
import { ThemeContext } from "../App";
import "../styles/PageWrapper.css"; // Shared styling

const EmployeesPage = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <SidebarLayout>
      <div className={`page-wrapper ${theme}`}>
        <h2><i className="fas fa-users"></i> Employee Management</h2>
        <EmployeeManager />
      </div>
    </SidebarLayout>
  );
};

export default EmployeesPage;
