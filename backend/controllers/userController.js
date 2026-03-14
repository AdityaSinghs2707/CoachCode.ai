const { User } = require("../models");
const bcrypt = require("bcryptjs");

const safeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

exports.list = async (req, res) => {
  try {
    const { role } = req.query;
    const where = role ? { role } : {};
    const users = await User.findAll({
      where,
      attributes: ["id", "name", "email", "role", "createdAt"],
      order: [["createdAt", "DESC"]],
    });
    return res.json({ success: true, data: users });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { attributes: ["id", "name", "email", "role", "createdAt"] });
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    return res.json({ success: true, data: safeUser(user) });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    const { name, email, role, password } = req.body;
    const allowedRoles = ["student", "faculty", "admin"];
    if (name != null) user.name = name;
    if (email != null) user.email = email;
    if (role != null && allowedRoles.includes(role)) user.role = role;
    if (password != null && password.length >= 6) user.password = await bcrypt.hash(password, 10);
    await user.save();
    return res.json({ success: true, data: safeUser(user) });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    if (user.id === req.user.id) {
      return res.status(400).json({ success: false, message: "Cannot delete your own account." });
    }
    await user.destroy();
    return res.json({ success: true, message: "User deleted." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
