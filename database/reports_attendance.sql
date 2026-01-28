SELECT
  e.name,
  a.date,
  a.clock_in,
  a.clock_out,
  ROUND(
    EXTRACT(EPOCH FROM (a.clock_out - a.clock_in)) / 3600,
    2
  ) AS worked_hours
FROM attendance a
JOIN employee e ON a.employee_id = e.employee_id
WHERE a.clock_out IS NOT NULL
ORDER BY a.date DESC;
