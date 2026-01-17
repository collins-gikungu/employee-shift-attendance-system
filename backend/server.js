const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const pool = require("./config/db");

const authRoutes = require('./routes/authRoutes');
const attendanceRoutes = require("./routes/attendanceRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const shiftRoutes = require("./routes/shiftRoutes");
const payrollRoutes = require("./routes/payrollRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Load environment variables
require("dotenv").config();

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || process.env.SECRET_KEY;
if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined.");
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api", dashboardRoutes); // dashboard-metrics will be under /api/dashboard-metrics
app.use("/api/shifts", shiftRoutes);
app.use("/api/payroll", payrollRoutes);

// Health Check Endpoint
app.get("/", async (req, res) => {
  try {
    const dbTest = await pool.query("SELECT NOW()");
    
    res.json({
      status: "OK",
      message: "Shift Management API is operational",
      version: "1.0.0",
      database: {
        connected: true,
        timestamp: dbTest.rows[0].now,
      },
      services: [
        "authentication",
        "attendance",
        "employee-management",
        "dashboard"
      ]
    });
  } catch (error) {
    res.status(500).json({
      status: "Partial Service",
      message: "API is running with database issues",
      version: "1.0.0",
      database: {
        connected: false,
        error: error.message,
      }
    });
  }
});

// Centralized Error Handling
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, err.stack);
  const response = {
    error: "Internal Server Error",
    requestId: req.id,
    timestamp: new Date().toISOString()
  };
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
    response.message = err.message;
  }
  res.status(500).json(response);
});

// Server Startup
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Database: ${process.env.DB_NAME}@${process.env.DB_HOST}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    pool.end();
    console.log('Server closed. Database connection pool ended.');
    process.exit(0);
  });
});

module.exports = { app, server };
