const { Op } = require("sequelize");
const { Material, Subject, User } = require("../models");
const path = require("path");
const fs = require("fs");

// 📌 LIST MATERIALS
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
    console.error("LIST ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 📌 GET BY ID
exports.getById = async (req, res) => {
  try {
    const material = await Material.findByPk(req.params.id, {
      include: [
        { model: Subject, as: "Subject", attributes: ["id", "name", "slug"] },
        { model: User, as: "User", attributes: ["id", "name"] },
      ],
    });

    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Material not found.",
      });
    }

    return res.json({ success: true, data: material });

  } catch (err) {
    console.error("GET ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 📌 🔥 FINAL SAFE UPLOAD (NO CRASH VERSION)
exports.upload = async (req, res) => {
  try {
    const { title, description, subjectId } = req.body;
    const file = req.file;

    console.log("BODY:", req.body);
    console.log("FILE:", file);

    // ✅ Basic validation
    if (!title || !subjectId) {
      return res.status(400).json({
        success: false,
        message: "Title and subjectId are required.",
      });
    }

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "File is required.",
      });
    }

    // ✅ Safe subjectId parse
    const parsedSubjectId = parseInt(subjectId, 10);
    if (isNaN(parsedSubjectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subjectId",
      });
    }

    // ✅ File URL
    const fileUrl = `/uploads/${file.filename}`;

    // 🔥 SAFE DB INSERT (NO USER DEPENDENCY)
    const material = await Material.create({
      title,
      description: description || null,
      fileUrl,
      subjectId: parsedSubjectId,
      uploadedById: null, // ✅ remove dependency on req.user
    });

    return res.status(201).json({
      success: true,
      data: material,
    });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message || "Upload failed",
    });
  }
};

// 📌 UPDATE MATERIAL
exports.update = async (req, res) => {
  try {
    const material = await Material.findByPk(req.params.id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Material not found.",
      });
    }

    const { title, description, subjectId } = req.body;

    if (title != null) material.title = title;
    if (description != null) material.description = description;
    if (subjectId != null) {
      material.subjectId = parseInt(subjectId, 10);
    }

    if (req.file) {
      material.fileUrl = `/uploads/${req.file.filename}`;
    }

    await material.save();

    return res.json({ success: true, data: material });

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 📌 DELETE MATERIAL
exports.remove = async (req, res) => {
  try {
    const material = await Material.findByPk(req.params.id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Material not found.",
      });
    }

    if (material.fileUrl) {
      const filename = path.basename(material.fileUrl);
      const filePath = path.join(__dirname, "..", "uploads", filename);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await material.destroy();

    return res.json({
      success: true,
      message: "Material deleted.",
    });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};