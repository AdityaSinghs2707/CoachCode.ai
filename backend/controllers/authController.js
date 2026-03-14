const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret-change-in-production";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "7d";

const safeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email and password are required." });
    }
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already registered." });
    }
    const allowedRoles = ["student", "faculty", "admin"];
    const finalRole = role && allowedRoles.includes(role) ? role : "student";
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role: finalRole });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    return res.status(201).json({ success: true, token, user: safeUser(user) });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || "Registration failed." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    return res.json({ success: true, token, user: safeUser(user) });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || "Login failed." });
  }
};

exports.me = async (req, res) => {
  try {
    return res.json({ success: true, user: safeUser(req.user) });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
