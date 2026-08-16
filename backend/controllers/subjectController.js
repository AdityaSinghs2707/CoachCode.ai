const { Subject } = require("../models");

exports.list = async (req, res) => {
  try {
    const subjects = await Subject.findAll({ order: [["name", "ASC"]] });
    return res.json({ success: true, data: subjects });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, slug, description } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Name is required." });
    const s = await Subject.create({
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
      description: description || null,
    });
    return res.status(201).json({ success: true, data: s });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
