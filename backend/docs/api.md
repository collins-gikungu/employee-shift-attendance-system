# Shift System API Documentation

## Authentication
POST /api/auth/login
POST /api/auth/register
All protected routes require a JWT token in the Authorization header:
Authorization: Bearer <token>

## Employees
GET /api/employees (Admin only)

## Attendance
POST /api/attendance/clock-in
POST /api/attendance/clock-out

## Dashboard
GET /api/dashboard/metrics

## Reports
GET /api/reports/attendance
GET /api/reports/department
