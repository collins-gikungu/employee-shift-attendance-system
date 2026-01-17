// routes/dashboardRoutes.js
const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const authenticateToken = require("../middleware/authMiddleware");

// 📊 Dashboard metrics summary
router.get("/dashboard-metrics", authenticateToken, async (req, res) => {
  try {
    const employees = await pool.query("SELECT COUNT(*) FROM employee");
    const shifts = await pool.query("SELECT COUNT(*) FROM shift");
    const attendanceToday = await pool.query(
      "SELECT COUNT(*) FROM attendance WHERE date = CURRENT_DATE"
    );
    const payrolls = await pool.query("SELECT COUNT(*) FROM payroll");

    res.json({
      employees: parseInt(employees.rows[0].count),
      shifts: parseInt(shifts.rows[0].count),
      attendanceToday: parseInt(attendanceToday.rows[0].count),
      payrolls: parseInt(payrolls.rows[0].count),
    });
  } catch (err) {
    console.error("Dashboard metrics error:", err.message);
    res.status(500).json({ error: "Failed to load dashboard metrics" });
  }
});


// 📊 📈 🧩 Dashboard Analytics
router.get("/dashboard-analytics", authenticateToken, async (req, res) => {
  try {
    // 1. 📊 Shifts per Employee
    const shiftQuery = await pool.query(`
      SELECT e.name, COUNT(s.shift_id) AS shift_count
      FROM employee e
      LEFT JOIN shift s ON e.employee_id = s.employee_id
      GROUP BY e.name
      ORDER BY shift_count DESC
      LIMIT 10;
    `);

    // 2. 📈 Attendance over time (last 7 days)
    const attendanceQuery = await pool.query(`
      SELECT date, COUNT(*) as count
      FROM attendance
      WHERE date >= CURRENT_DATE - INTERVAL '6 days'
      GROUP BY date
      ORDER BY date ASC;
    `);

    // 3. 🧩 Role Distribution
    const roleQuery = await pool.query(`
      SELECT role, COUNT(*) as count
      FROM employee
      GROUP BY role;
    `);

    const shiftsPerEmployee = shiftQuery.rows;
    const attendanceOverTime = attendanceQuery.rows.map(r => ({
      date: r.date.toISOString().split("T")[0],
      count: parseInt(r.count),
    }));
    const rolesDistribution = {};
    roleQuery.rows.forEach(r => {
      rolesDistribution[r.role] = parseInt(r.count);
    });

    res.json({
      shiftsPerEmployee,
      attendanceOverTime,
      rolesDistribution,
    });
  } catch (err) {
    console.error("Analytics error:", err.message);
    res.status(500).json({ error: "Failed to load analytics data" });
  }
});

module.exports = router;
