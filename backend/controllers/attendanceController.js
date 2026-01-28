const pool = require("../config/db");

// CLOCK IN
exports.clockIn = async (req, res) => {
  const employeeId = req.user.employee_id;
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const timestamp = now.toISOString();

  try {
    // 1. Prevent double clock-in
    const existing = await pool.query(
      "SELECT 1 FROM attendance WHERE employee_id = $1 AND date = $2",
      [employeeId, today]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Already clocked in today" });
    }

    // 2. Find active shift
    const shift = await pool.query(
      `
      SELECT shift_id FROM shifts
      WHERE employee_id = $1
      AND status = 'Scheduled'
      AND start_time <= $2
      AND end_time >= $2
      `,
      [employeeId, timestamp]
    );

    if (shift.rows.length === 0) {
      return res.status(403).json({
        message: "No active shift at this time",
      });
    }

    // 3. Insert attendance linked to shift
    const result = await pool.query(
      `
      INSERT INTO attendance (employee_id, date, clock_in, shift_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [employeeId, today, timestamp, shift.rows[0].shift_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({
      message: "Clock-in failed",
      detail: err.message,
    });
  }
};

// CLOCK OUT 
exports.clockOut = async (req, res) => {
  const employeeId = req.user.employee_id;
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const timestamp = now.toISOString();

  try {
    const existing = await pool.query(
      `
      SELECT * FROM attendance
      WHERE employee_id = $1
      AND date = $2
      `,
      [employeeId, today]
    );

    if (existing.rows.length === 0) {
      return res.status(400).json({ message: "You must clock in first." });
    }

    const record = existing.rows[0];

    if (record.clock_out) {
      return res.status(400).json({ message: "Already clocked out today." });
    }

    const result = await pool.query(
      `
      UPDATE attendance
      SET clock_out = $1
      WHERE id = $2
      RETURNING *
      `,
      [timestamp, record.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({
      message: "Clock-out failed",
      detail: err.message,
    });
  }
};


// GET ALL ATTENDANCE (Admin)
exports.getAllAttendance = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        a.*, 
        e.name AS employee_name
      FROM attendance a
      JOIN employee e ON a.employee_id = e.employee_id
      ORDER BY a.date DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch attendance",
      detail: err.message,
    });
  }
};

// GET MY ATTENDANCE (Employee)
exports.getMyAttendance = async (req, res) => {
  const employeeId = req.user.employee_id;

  try {
    const result = await pool.query(
      `SELECT 
         a.*, 
         e.name AS employee_name
       FROM attendance a
       JOIN employee e ON a.employee_id = e.employee_id
       WHERE a.employee_id = $1
       ORDER BY a.date DESC`,
      [employeeId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch your attendance",
      detail: err.message,
    });
  }
};

// DELETE (Admin only)
exports.deleteAttendance = async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query("DELETE FROM attendance WHERE attendance_id = $1", [id]);
    res.json({ message: "Attendance entry deleted successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete attendance",
      detail: err.message,
    });
  }
};
