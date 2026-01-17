// src/components/EmployeeManager.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EmployeeManager.css";
import jsPDF from "jspdf";
import "jspdf-autotable";


const EmployeeManager = () => {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "employee",
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/employees", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch employees.");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/employees/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("http://localhost:5000/api/employees", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setForm({ name: "", email: "", role: "employee" });
      setEditingId(null);
      fetchEmployees();
    } catch (err) {
      console.error("Save error:", err);
      setError("Failed to save employee.");
    }
  };

  const handleEdit = (emp) => {
    setForm({ name: emp.name, email: emp.email, role: emp.role });
    setEditingId(emp.employee_id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEmployees();
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete employee.");
    }
  };
  const exportEmployeesToCSV = () => {
    const headers = ["Name", "Email", "Role"];
    const rows = employees.map((emp) => [emp.username, emp.email, emp.role]);
  
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "employees_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const exportEmployeesToPDF = () => {
    const doc = new jsPDF();
    doc.text("Employee List", 14, 16);
  
    const tableData = employees.map((emp) => [
      emp.username,
      emp.email,
      emp.role,
    ]);
  
    doc.autoTable({
      startY: 20,
      head: [["Name", "Email", "Role"]],
      body: tableData,
    });
  
    doc.save("employees_export.pdf");
  };
  

  return (
    <div className="employee-manager">
      <h2><i className="fas fa-users"></i> Manage Employees</h2>

      {error && <p className="error">{error}</p>}
      <div className="employee-exports">
  <button className="export-btn" onClick={exportEmployeesToCSV}>
    📤 Export CSV
  </button>
  <button className="export-btn" onClick={exportEmployeesToPDF}>
    🧾 Export PDF
  </button>
</div>

      <form className="employee-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
        />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">{editingId ? "Update" : "Add"} Employee</button>
      </form>

      <table className="employee-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp, index) => (
            <tr key={emp.employee_id}>
              <td>{index + 1}</td>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.role}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(emp)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(emp.employee_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeManager;
