// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);

    // ✅ Normalize decoded.id as employee_id
    req.user = {
      id: decoded.id,             // still available as req.user.id
      employee_id: decoded.id,    // allows compatibility with old logic expecting employee_id
      email: decoded.email,
      role: decoded.role,
    };

    router.get(
  "/preview",
  authMiddleware,
  adminOnly,
  payrollController.getPayrollPreview
);


    next();
  });
};

module.exports = authenticateToken;
