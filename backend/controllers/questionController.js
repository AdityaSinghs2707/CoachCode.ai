const { Op } = require("sequelize");
const { Question, Subject, User } = require("../models");

exports.list = async (req, res) => {
  try {
    const { subjectId, difficulty, company, type } = req.query;
    const where = {};
    if (subjectId) where.subjectId = subjectId;
    if (difficulty) where.difficulty = difficulty;
    if (company) where.companyTag = { [Op.like]: `%${company}%` };
    if (type) where.type = type;
    const questions = await Question.findAll({
      where,
      include: [
        { model: Subject, as: "Subject", attributes: ["id", "name", "slug"], required: false },
        { model: User, as: "User", attributes: ["id", "name"], required: false },
      ],
      order: [["createdAt", "DESC"]],
    });
    return res.json({ success: true, data: questions });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id, {
      include: [
        { model: Subject, as: "Subject", attributes: ["id", "name", "slug"] },
        { model: User, as: "User", attributes: ["id", "name"] },
      ],
    });
    if (!question) return res.status(404).json({ success: false, message: "Question not found." });
    return res.json({ success: true, data: question });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, description, type, difficulty, companyTag, starterCode, solutionCode, subjectId } = req.body;
    if (!title || !description) {
      return res.status(400).json({ success: false, message: "Title and description are required." });
    }
    const question = await Question.create({
      title,
      description,
      type: type || "coding",
      difficulty: difficulty || "medium",
      companyTag: companyTag || null,
      starterCode: starterCode || null,
      solutionCode: solutionCode || null,
      subjectId: subjectId ? parseInt(subjectId, 10) : null,
      createdById: req.user.id,
    });
    return res.status(201).json({ success: true, data: question });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id);
    if (!question) return res.status(404).json({ success: false, message: "Question not found." });
    const fields = ["title", "description", "type", "difficulty", "companyTag", "starterCode", "solutionCode", "subjectId"];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) question[f] = f === "subjectId" ? (req.body[f] ? parseInt(req.body[f], 10) : null) : req.body[f];
    });
    await question.save();
    return res.json({ success: true, data: question });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id);
    if (!question) return res.status(404).json({ success: false, message: "Question not found." });
    await question.destroy();
    return res.json({ success: true, message: "Question deleted." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.submitAttempt = async (req, res) => {
  try {
    const { QuestionAttempt } = require("../models");
    const { code, language, status, score } = req.body;
    const questionId = parseInt(req.params.id, 10);
    const attempt = await QuestionAttempt.create({
      userId: req.user.id,
      questionId,
      code: code || null,
      language: language || null,
      status: status || "pending",
      score: score != null ? score : null,
    });
    return res.status(201).json({ success: true, data: attempt });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
