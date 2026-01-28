exports.getPayrollPreview = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        a.id AS attendance_id,
        e.name AS employee_name,
        s.shift_name,
        ROUND(
          EXTRACT(EPOCH FROM (a.clock_out - a.clock_in)) / 3600,
          2
        ) AS worked_hours,
        ROUND(
          EXTRACT(EPOCH FROM (s.end_time - s.start_time)) / 3600,
          2
        ) AS scheduled_hours,
        GREATEST(
          ROUND(
            (EXTRACT(EPOCH FROM (a.clock_out - a.clock_in))
            - EXTRACT(EPOCH FROM (s.end_time - s.start_time))) / 3600,
            2
          ),
          0
        ) AS overtime_hours
      FROM attendance a
      JOIN shift s ON a.shift_id = s.shift_id
      JOIN employee e ON a.employee_id = e.employee_id
      WHERE a.clock_out IS NOT NULL
      ORDER BY a.date DESC
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({
      message: "Payroll preview failed",
      detail: err.message,
    });
  }
};
