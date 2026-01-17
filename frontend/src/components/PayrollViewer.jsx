import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./PayrollViewer.css";

const PayrollViewer = ({ token }) => {
  const [payrolls, setPayrolls] = useState([]);
  const [employees, setEmployees] = useState({});
  const [error, setError] = useState("");
  const [totalThisMonth, setTotalThisMonth] = useState(0);

  useEffect(() => {
    if (token) {
      fetchPayrolls();
      fetchEmployees();
    }
  }, [token]);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/employees", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const map = {};
      res.data.forEach((emp) => {
        map[emp.employee_id] = emp.name;
      });
      setEmployees(map);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    }
  };

  const fetchPayrolls = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/payroll", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayrolls(res.data);
      calculateCurrentMonthTotal(res.data);
    } catch (err) {
      console.error("Error fetching payrolls:", err);
      setError("Failed to load payroll data.");
    }
  };

  const formatMonth = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  const calculateCurrentMonthTotal = (data) => {
    const now = new Date();
    const total = data.reduce((sum, record) => {
      const date = new Date(record.processed_date);
      if (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      ) {
        return sum + (parseFloat(record.salary) || 0);
      }
      return sum;
    }, 0);
    setTotalThisMonth(total);
  };

  const exportPayrollToCSV = () => {
    const headers = ["Employee", "Month", "Hours Worked", "Total Pay"];
    const rows = payrolls.map((p) => [
      employees[p.employee_id] || "Unknown",
      formatMonth(p.processed_date),
      p.total_hours,
      p.salary,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "payroll_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPayrollToPDF = () => {
    const doc = new jsPDF();
    doc.text("Payroll Report", 14, 16);

    const tableData = payrolls.map((p) => [
      employees[p.employee_id] || "Unknown",
      formatMonth(p.processed_date),
      p.total_hours,
      p.salary,
    ]);

    doc.autoTable({
      startY: 20,
      head: [["Employee", "Month", "Hours Worked", "Total Pay"]],
      body: tableData,
    });

    doc.save("payroll_export.pdf");
  };

  return (
    <div className="payroll-viewer">
      <h3><i className="fas fa-file-invoice-dollar"></i> Payroll Records</h3>
      {error && <p className="error">{error}</p>}

      <div className="payroll-summary">
        💰 Total Payout (This Month): <strong>KES {totalThisMonth.toLocaleString()}</strong>
      </div>

      <div className="payroll-exports">
        <button className="export-btn" onClick={exportPayrollToCSV}>📤 Export CSV</button>
        <button className="export-btn" onClick={exportPayrollToPDF}>🧾 Export PDF</button>
      </div>

      <table className="payroll-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Employee</th>
            <th>Month</th>
            <th>Hours Worked</th>
            <th>Total Pay (KES)</th>
          </tr>
        </thead>
        <tbody>
          {payrolls.map((record, index) => (
            <tr key={record.payroll_id || index}>
              <td>{index + 1}</td>
              <td>{employees[record.employee_id] || "Unknown"}</td>
              <td>{formatMonth(record.processed_date)}</td>
              <td>{record.total_hours}</td>
              <td>{record.salary?.toLocaleString() || "0.00"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PayrollViewer;
