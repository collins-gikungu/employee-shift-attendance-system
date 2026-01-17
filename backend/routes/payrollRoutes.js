// routes/payrollRoutes.js
const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const authenticateJWT = require("../middleware/authMiddleware");

// Get all payroll records
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM payroll ORDER BY payroll_id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch payroll records", detail: err.message });
  }
});

// Add new payroll record
router.post("/", authenticateJWT, async (req, res) => {
  const { employee_id, total_hours, overtime_hours, salary } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO payroll (employee_id, total_hours, overtime_hours, salary, processed_date)
       VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
      [employee_id, total_hours, overtime_hours, salary]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to create payroll", detail: err.message });
  }
});

// Update payroll record
router.put("/:id", authenticateJWT, async (req, res) => {
  const { total_hours, overtime_hours, salary } = req.body;
  try {
    const result = await pool.query(
      `UPDATE payroll
       SET total_hours = $1,
           overtime_hours = $2,
           salary = $3,
           processed_date = NOW()
       WHERE payroll_id = $4
       RETURNING *`,
      [total_hours, overtime_hours, salary, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update payroll", detail: err.message });
  }
});

// Delete payroll
router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    await pool.query("DELETE FROM payroll WHERE payroll_id = $1", [req.params.id]);
    res.json({ message: "Payroll record deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete payroll", detail: err.message });
  }
});

module.exports = router;
