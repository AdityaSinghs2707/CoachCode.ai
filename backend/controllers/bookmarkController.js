const { Bookmark, Question, Material } = require("../models");

exports.list = async (req, res) => {
  try {
    const bookmarks = await Bookmark.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    const questionIds = bookmarks.filter((b) => b.itemType === "question").map((b) => b.itemId);
    const materialIds = bookmarks.filter((b) => b.itemType === "material").map((b) => b.itemId);
    const [questions, materials] = await Promise.all([
      Question.findAll({ where: { id: questionIds } }),
      Material.findAll({ where: { id: materialIds } }),
    ]);
    const qMap = Object.fromEntries(questions.map((q) => [q.id, q]));
    const mMap = Object.fromEntries(materials.map((m) => [m.id, m]));
    const data = bookmarks.map((b) => ({
      ...b.toJSON(),
      item: b.itemType === "question" ? qMap[b.itemId] : mMap[b.itemId],
    }));
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.add = async (req, res) => {
  try {
    const { itemType, itemId } = req.body;
    if (!itemType || !itemId) {
      return res.status(400).json({ success: false, message: "itemType and itemId are required." });
    }
    if (!["question", "material"].includes(itemType)) {
      return res.status(400).json({ success: false, message: "itemType must be question or material." });
    }
    const [bookmark] = await Bookmark.findOrCreate({
      where: { userId: req.user.id, itemType, itemId: parseInt(itemId, 10) },
    });
    return res.status(201).json({ success: true, data: bookmark });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Bookmark.destroy({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!deleted) return res.status(404).json({ success: false, message: "Bookmark not found." });
    return res.json({ success: true, message: "Bookmark removed." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
