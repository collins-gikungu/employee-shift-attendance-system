// routes/attendanceRoutes.js
const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");
const authenticateToken = require("../middleware/authMiddleware");

// Clock In
router.post("/clock-in", authenticateToken, attendanceController.clockIn);

// Clock Out
router.post("/clock-out", authenticateToken, attendanceController.clockOut);

// Get All Attendance (admin only)
router.get("/", authenticateToken, attendanceController.getAllAttendance);

// Get My Attendance (employee)
router.get("/me", authenticateToken, attendanceController.getMyAttendance);

module.exports = router;
