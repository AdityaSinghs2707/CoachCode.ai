const { Announcement, User } = require("../models");

exports.list = async (req, res) => {
  try {
    const announcements = await Announcement.findAll({
      include: [{ model: User, as: "User", attributes: ["id", "name"] }],
      order: [["createdAt", "DESC"]],
    });
    return res.json({ success: true, data: announcements });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, body } = req.body;
    if (!title || !body) {
      return res.status(400).json({ success: false, message: "Title and body are required." });
    }
    const announcement = await Announcement.create({
      title,
      body,
      createdById: req.user.id,
    });
    return res.status(201).json({ success: true, data: announcement });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const announcement = await Announcement.findByPk(req.params.id);
    if (!announcement) return res.status(404).json({ success: false, message: "Announcement not found." });
    const { title, body } = req.body;
    if (title != null) announcement.title = title;
    if (body != null) announcement.body = body;
    await announcement.save();
    return res.json({ success: true, data: announcement });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const announcement = await Announcement.findByPk(req.params.id);
    if (!announcement) return res.status(404).json({ success: false, message: "Announcement not found." });
    await announcement.destroy();
    return res.json({ success: true, message: "Announcement deleted." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
