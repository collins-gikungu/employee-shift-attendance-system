SELECT
  a.id AS attendance_id,
  e.name AS employee_name,
  s.shift_name,
  s.start_time,
  s.end_time,
  a.clock_in,
  a.clock_out,

  -- worked hours
  ROUND(
    EXTRACT(EPOCH FROM (a.clock_out - a.clock_in)) / 3600,
    2
  ) AS worked_hours,

  -- scheduled shift hours
  ROUND(
    EXTRACT(EPOCH FROM (s.end_time - s.start_time)) / 3600,
    2
  ) AS scheduled_hours,

  -- overtime
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
WHERE a.clock_out IS NOT NULL;
