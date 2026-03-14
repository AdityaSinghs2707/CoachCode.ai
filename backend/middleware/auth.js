const jwt = require("jsonwebtoken");
const { User } = require("../models");

/**
 * Authenticate: verify JWT and attach req.user (id, email, role).
 * Use on all protected routes.
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-jwt-secret-change-in-production");
    const user = await User.findByPk(decoded.id, { attributes: ["id", "name", "email", "role"] });
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found." });
    }
    req.user = user;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Invalid or expired token." });
    }
    next(err);
  }
};

/**
 * Require role: use after authenticate. Restricts access to given roles.
 * @param {string[]} allowedRoles - e.g. ['admin', 'faculty']
 */
const requireRole = (allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Authentication required." });
  }
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: "Insufficient permissions." });
  }
  next();
};

module.exports = { authenticate, requireRole };
