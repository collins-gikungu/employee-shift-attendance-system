exports.createShift = async (req, res) => {
  const { employee_id, start_time, end_time, shift_name } = req.body;

  if (!employee_id || !start_time || !end_time) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (new Date(start_time) >= new Date(end_time)) {
    return res.status(400).json({ message: "Start time must be before end time" });
  }

  try {
    // Check overlapping shifts
    const overlap = await pool.query(
      `
      SELECT 1 FROM shifts
      WHERE employee_id = $1
      AND status = 'Scheduled'
      AND (
        start_time < $3
        AND end_time > $2
      )
      `,
      [employee_id, start_time, end_time]
    );

    if (overlap.rows.length > 0) {
      return res.status(409).json({
        message: "Shift overlaps with an existing scheduled shift",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO shifts (employee_id, start_time, end_time, shift_name, status)
      VALUES ($1, $2, $3, $4, 'Scheduled')
      RETURNING *
      `,
      [employee_id, start_time, end_time, shift_name]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({
      message: "Shift creation failed",
      detail: err.message,
    });
  }
};

exports.cancelShift = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      UPDATE shifts
      SET status = 'Cancelled'
      WHERE shift_id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Shift not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({
      message: "Failed to cancel shift",
      detail: err.message,
    });
  }
};
