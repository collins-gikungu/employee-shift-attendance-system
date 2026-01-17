// src/pages/PayrollPage.jsx
import React, { useContext } from "react";
import SidebarLayout from "../components/SidebarLayout";
import PayrollViewer from "../components/PayrollViewer";
import { ThemeContext } from "../App";
import "../styles/PageWrapper.css";

const PayrollPage = () => {
  const { theme } = useContext(ThemeContext);
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  return (
    <SidebarLayout>
      <div className={`page-wrapper ${theme}`}>
        <h2><i className="fas fa-file-invoice-dollar"></i> Payroll Overview</h2>
        <PayrollViewer token={token} />
      </div>
    </SidebarLayout>
  );
};

export default PayrollPage;
