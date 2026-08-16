const { Note } = require("../models");

exports.list = async (req, res) => {
  try {
    const notes = await Note.findAll({
      where: { userId: req.user.id },
      order: [["updatedAt", "DESC"]],
    });
    return res.json({ success: true, data: notes });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const note = await Note.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!note) return res.status(404).json({ success: false, message: "Note not found." });
    return res.json({ success: true, data: note });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = await Note.create({
      userId: req.user.id,
      title: title || "Untitled",
      content: content || "",
    });
    return res.status(201).json({ success: true, data: note });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const note = await Note.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!note) return res.status(404).json({ success: false, message: "Note not found." });
    const { title, content } = req.body;
    if (title != null) note.title = title;
    if (content != null) note.content = content;
    await note.save();
    return res.json({ success: true, data: note });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Note.destroy({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!deleted) return res.status(404).json({ success: false, message: "Note not found." });
    return res.json({ success: true, message: "Note deleted." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
