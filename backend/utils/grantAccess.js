// utils/grantAccess.js
const jwt = require("jsonwebtoken");
const db = require("../db");

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware: Authenticates token and attaches user
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Access token missing" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid or expired token" });
    req.user = user;
    next();
  });
}

// Helper: Check if user is admin
function isAdmin(user) {
  return user && user.role_name === "admin";
}

// Helper: Check if user is owner or admin
function canAccessResource(user, resourceOwnerId) {
  return isAdmin(user) || user.id === resourceOwnerId;
}

// Middleware: Role-based permission check
function checkAccess(resource, action) {
  return async (req, res, next) => {
    if (isAdmin(req.user)) return next();

    const validActions = ["can_create", "can_read", "can_update", "can_delete"];
    if (!validActions.includes(action)) {
      return res.status(400).json({ error: "Invalid access action" });
    }

    try {
      const result = await db.query(
        `SELECT ${validActions.join(", ")} FROM accesses WHERE role_id = $1 AND resource = $2 LIMIT 1`,
        [req.user.role_id, resource]
      );

      if (result.rows.length === 0 || !result.rows[0][action]) {
        return res.status(403).json({ error: "Access denied" });
      }

      next();
    } catch (err) {
      console.error("Access check error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}

module.exports = {
  authenticateToken,
  checkAccess,
  isAdmin,
  canAccessResource,
};
