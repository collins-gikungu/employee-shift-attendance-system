const pool = require("../config/db");

// CLOCK IN
exports.clockIn = async (req, res) => {
  const employeeId = req.user.employee_id;

  try {
    // Check for an active (not clocked out) attendance today
    const existing = await pool.query(
      `
      SELECT * FROM attendance
      WHERE employee_id = $1
        AND date = CURRENT_DATE
        AND clock_out IS NULL
      `,
      [employeeId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        message: "You are already clocked in and have not clocked out",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO attendance (employee_id, date, clock_in)
      VALUES ($1, CURRENT_DATE, NOW())
      RETURNING *
      `,
      [employeeId]
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

  try {
    // Find active attendance for today
    const existing = await pool.query(
      `
      SELECT * FROM attendance
      WHERE employee_id = $1
        AND date = CURRENT_DATE
        AND clock_out IS NULL
      `,
      [employeeId]
    );

    if (existing.rows.length === 0) {
      return res.status(400).json({
        message: "No active clock-in found for today",
      });
    }

    const attendanceId = existing.rows[0].attendance_id;

    const result = await pool.query(
      `
      UPDATE attendance
      SET clock_out = NOW()
      WHERE attendance_id = $1
      RETURNING *
      `,
      [attendanceId]
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
