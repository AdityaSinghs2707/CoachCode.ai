const { Op } = require("sequelize");
const { Material, Subject, User } = require("../models");
const path = require("path");
const fs = require("fs");

exports.list = async (req, res) => {
  try {
    const { subjectId, search } = req.query;
    const where = {};
    if (subjectId) where.subjectId = subjectId;
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }
    const materials = await Material.findAll({
      where,
      include: [
        { model: Subject, as: "Subject", attributes: ["id", "name", "slug"] },
        { model: User, as: "User", attributes: ["id", "name"], required: false },
      ],
      order: [["createdAt", "DESC"]],
    });
    return res.json({ success: true, data: materials });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const material = await Material.findByPk(req.params.id, {
      include: [
        { model: Subject, as: "Subject", attributes: ["id", "name", "slug"] },
        { model: User, as: "User", attributes: ["id", "name"] },
      ],
    });
    if (!material) return res.status(404).json({ success: false, message: "Material not found." });
    return res.json({ success: true, data: material });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.upload = async (req, res) => {
  try {
    const { title, description, subjectId, fileType } = req.body;
    const file = req.file;
    if (!title || !subjectId) {
      return res.status(400).json({ success: false, message: "Title and subjectId are required." });
    }
    const fileUrl = file ? `/uploads/${file.filename}` : null;
    if (!fileUrl) return res.status(400).json({ success: false, message: "File is required." });
    const material = await Material.create({
      title,
      description: description || null,
      fileUrl,
      fileType: fileType || "other",
      subjectId: parseInt(subjectId, 10),
      uploadedById: req.user.id,
    });
    return res.status(201).json({ success: true, data: material });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const material = await Material.findByPk(req.params.id);
    if (!material) return res.status(404).json({ success: false, message: "Material not found." });
    const { title, description, subjectId, fileType } = req.body;
    if (title != null) material.title = title;
    if (description != null) material.description = description;
    if (subjectId != null) material.subjectId = parseInt(subjectId, 10);
    if (fileType != null) material.fileType = fileType;
    if (req.file) material.fileUrl = `/uploads/${req.file.filename}`;
    await material.save();
    return res.json({ success: true, data: material });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const material = await Material.findByPk(req.params.id);
    if (!material) return res.status(404).json({ success: false, message: "Material not found." });
    if (material.fileUrl) {
      const filename = path.basename(material.fileUrl);
      const filePath = path.join(__dirname, "..", "uploads", filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await material.destroy();
    return res.json({ success: true, message: "Material deleted." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
