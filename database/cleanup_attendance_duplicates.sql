-- Cleanup duplicate attendance records
-- Uses PostgreSQL ctid for safety

DELETE FROM attendance a
USING attendance b
WHERE a.employee_id = b.employee_id
  AND a.date = b.date
  AND a.ctid > b.ctid;

-- Prevent future duplicates
ALTER TABLE attendance
ADD CONSTRAINT unique_employee_date UNIQUE (employee_id, date);
