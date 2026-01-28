# Shift System API Documentation

## Authentication
All protected routes require a JWT token in the Authorization header:

Authorization: Bearer <token>

## Attendance
### Clock In
POST /api/attendance/clock-in

### Clock Out
POST /api/attendance/clock-out
