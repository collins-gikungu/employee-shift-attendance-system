const express = require('express');
const pool = require('../config/db');
const router = express.Router();

const authenticateJWT = require('../middleware/authMiddleware');

// Get all employees
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM employee ORDER BY employee_id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch employees", detail: err.message });
  }
});

// Add new employee
router.post("/", authenticateJWT, async (req, res) => {
  const { user_id, name, email, phone, role, position, department } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO employee (user_id, name, email, phone, role, position, department, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *`,
      [user_id, name, email, phone, role, position, department]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to create employee", detail: err.message });
  }
});

// Update employee
router.put("/:id", authenticateJWT, async (req, res) => {
  const { name, email, role } = req.body;
  try {
    const result = await pool.query(
      "UPDATE employee SET name = $1, email = $2, role = $3 WHERE employee_id = $4 RETURNING *",
      [name, email, role, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update employee", detail: err.message });
  }
});

// Delete employee
router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    await pool.query("DELETE FROM employee WHERE employee_id = $1", [req.params.id]);
    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete employee", detail: err.message });
  }
});

module.exports = router;
