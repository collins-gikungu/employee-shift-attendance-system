const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const authenticateJWT = require("../middleware/authMiddleware");

// Get all shifts
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM shift ORDER BY shift_id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch shifts", detail: err.message });
  }
});

// Create a new shift
router.post("/", authenticateJWT, async (req, res) => {
  const { employee_id, start_time, end_time, status, shift_name } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO shift (employee_id, start_time, end_time, status, shift_name) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [employee_id, start_time, end_time, status, shift_name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to create shift", detail: err.message });
  }
});

// Update a shift
router.put("/:id", authenticateJWT, async (req, res) => {
  const { employee_id, start_time, end_time, status, shift_name } = req.body;
  try {
    const result = await pool.query(
      `UPDATE shift 
       SET employee_id = $1, start_time = $2, end_time = $3, status = $4, shift_name = $5 
       WHERE shift_id = $6 RETURNING *`,
      [employee_id, start_time, end_time, status, shift_name, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update shift", detail: err.message });
  }
});

// Delete a shift
router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    await pool.query("DELETE FROM shift WHERE shift_id = $1", [req.params.id]);
    res.json({ message: "Shift deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete shift", detail: err.message });
  }
});

module.exports = router;
