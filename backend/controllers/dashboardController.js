exports.getAdminMetrics = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM employee) AS total_employees,
        (SELECT COUNT(DISTINCT employee_id)
         FROM shift
         WHERE DATE(start_time) = CURRENT_DATE
         AND status = 'Scheduled') AS scheduled_today,
        (SELECT COUNT(*)
         FROM attendance
         WHERE clock_in IS NOT NULL
         AND clock_out IS NULL) AS currently_clocked_in,
        (SELECT COUNT(*)
         FROM attendance a
         JOIN shift s ON a.shift_id = s.shift_id
         WHERE a.clock_out IS NOT NULL
         AND EXTRACT(EPOCH FROM (a.clock_out - a.clock_in))
           > EXTRACT(EPOCH FROM (s.end_time - s.start_time))
        ) AS overtime_cases
    `);

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({
      message: "Failed to load dashboard metrics",
      detail: err.message,
    });
  }
};
