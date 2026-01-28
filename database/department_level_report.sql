SELECT
  e.department,
  COUNT(*) AS attendance_count,
  ROUND(
    SUM(EXTRACT(EPOCH FROM (a.clock_out - a.clock_in)) / 3600),
    2
  ) AS total_hours
FROM attendance a
JOIN employee e ON a.employee_id = e.employee_id
WHERE a.clock_out IS NOT NULL
GROUP BY e.department;
