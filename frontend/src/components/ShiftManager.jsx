// src/components/ShiftManager.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ShiftManager.css";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ShiftManager = () => {
  const [shifts, setShifts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({
    shift_name: "",
    start_time: "",
    end_time: "",
    employee_id: "",
    status: "Scheduled",
  });
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchShifts();
    fetchEmployees();
  }, []);

  const fetchShifts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/shifts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShifts(res.data);
    } catch (err) {
      console.error("Failed to fetch shifts:", err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/employees", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    }
  };

  const toFullTime = (timeStr) => {
    const today = new Date().toISOString().split("T")[0];
    return `${today} ${timeStr}:00`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      shift_name: form.shift_name,
      start_time: toFullTime(form.start_time),
      end_time: toFullTime(form.end_time),
      employee_id: form.employee_id === "" ? null : parseInt(form.employee_id),
      status: form.status,
    };

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/shifts/${editingId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post("http://localhost:5000/api/shifts", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setForm({
        shift_name: "",
        start_time: "",
        end_time: "",
        employee_id: "",
        status: "Scheduled",
      });
      setEditingId(null);
      fetchShifts();
    } catch (err) {
      console.error("❌ Failed to save shift:", err);
      alert("Error saving shift. Please check the form and try again.");
    }
  };

  const handleEdit = (shift) => {
    setForm({
      shift_name: shift.shift_name,
      start_time: shift.start_time.split(" ")[1]?.slice(0, 5) || "",
      end_time: shift.end_time.split(" ")[1]?.slice(0, 5) || "",
      employee_id: shift.employee_id || "",
      status: shift.status || "Scheduled",
    });
    setEditingId(shift.shift_id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/shifts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchShifts();
    } catch (err) {
      console.error("Failed to delete shift:", err);
    }
  };

  const filteredShifts = shifts.filter((shift) =>
    shift.shift_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToCSV = () => {
    const headers = ["Shift Name", "Start Time", "End Time", "Employee", "Status"];
    const rows = shifts.map((shift) => {
      const emp = employees.find((e) => e.employee_id === shift.employee_id);
      return [
        shift.shift_name,
        shift.start_time,
        shift.end_time,
        emp?.name || "Unassigned",
        shift.status || "Scheduled",
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "shifts_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Shift Schedule Export", 14, 16);

    const tableData = shifts.map((shift) => {
      const emp = employees.find((e) => e.employee_id === shift.employee_id);
      return [
        shift.shift_name,
        shift.start_time,
        shift.end_time,
        emp?.name || "Unassigned",
        shift.status || "Scheduled",
      ];
    });

    doc.autoTable({
      startY: 20,
      head: [["Shift Name", "Start Time", "End Time", "Employee", "Status"]],
      body: tableData,
    });

    doc.save("shifts_export.pdf");
  };

  return (
    <div className="shift-manager">
      <h2><i className="fas fa-calendar-alt"></i> Manage Shifts</h2>

      {/* 🔍 Search Field */}
      <input
        type="text"
        placeholder="Search by shift name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <div className="shift-exports">
        <button className="export-btn" onClick={exportToCSV}>
          📤 Export CSV
        </button>
        <button className="export-btn" onClick={exportToPDF}>
          🧾 Export PDF
        </button>
      </div>

      {/* ➕ Add/Edit Form */}
      <form className="shift-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Shift Name"
          value={form.shift_name}
          onChange={(e) => setForm({ ...form, shift_name: e.target.value })}
          required
        />
        <input
          type="time"
          value={form.start_time}
          onChange={(e) => setForm({ ...form, start_time: e.target.value })}
          required
        />
        <input
          type="time"
          value={form.end_time}
          onChange={(e) => setForm({ ...form, end_time: e.target.value })}
          required
        />
        <select
          value={form.employee_id}
          onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
        >
          <option value="">Assign to Employee (Optional)</option>
          {employees.map((emp) => (
            <option key={emp.employee_id} value={emp.employee_id}>
              {emp.name || emp.username}
            </option>
          ))}
        </select>

        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="Scheduled">Scheduled</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <button type="submit">{editingId ? "Update Shift" : "Add Shift"}</button>
      </form>

      {/* 📋 Table */}
      <table className="shift-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Shift Name</th>
            <th>Start</th>
            <th>End</th>
            <th>Employee</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredShifts.map((shift, index) => (
            <tr key={shift.shift_id}>
              <td>{index + 1}</td>
              <td>{shift.shift_name}</td>
              <td>{shift.start_time}</td>
              <td>{shift.end_time}</td>
              <td>
                {
                  employees.find((emp) => emp.employee_id === shift.employee_id)
                    ?.name || "Unassigned"
                }
              </td>
              <td>{shift.status}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(shift)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(shift.shift_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShiftManager;
