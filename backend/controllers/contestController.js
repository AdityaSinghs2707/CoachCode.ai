const { Contest, ContestSubmission, User, Question } = require("../models");
const { Op } = require("sequelize");

exports.list = async (req, res) => {
  try {
    const contests = await Contest.findAll({
      include: [{ model: User, as: "User", attributes: ["id", "name"] }],
      order: [["startTime", "DESC"]],
    });
    return res.json({ success: true, data: contests });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const contest = await Contest.findByPk(req.params.id, {
      include: [{ model: User, as: "User", attributes: ["id", "name"] }],
    });
    if (!contest) return res.status(404).json({ success: false, message: "Contest not found." });
    return res.json({ success: true, data: contest });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.leaderboard = async (req, res) => {
  try {
    const { id } = req.params;
    const subs = await ContestSubmission.findAll({
      where: { contestId: id },
      include: [{ model: User, as: "User", attributes: ["id", "name"] }],
    });
    const byUser = {};
    for (const s of subs) {
      const uid = s.userId;
      if (!byUser[uid]) byUser[uid] = { userId: uid, name: s.User?.name, totalScore: 0, submissions: 0, lastSubmit: null };
      byUser[uid].totalScore += s.score || 0;
      byUser[uid].submissions += 1;
      if (!byUser[uid].lastSubmit || new Date(s.submittedAt) > new Date(byUser[uid].lastSubmit)) {
        byUser[uid].lastSubmit = s.submittedAt;
      }
    }
    const leaderboard = Object.values(byUser)
      .sort((a, b) => {
        if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
        return new Date(a.lastSubmit) - new Date(b.lastSubmit);
      })
      .map((u, i) => ({ rank: i + 1, ...u }));
    return res.json({ success: true, data: leaderboard });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, description, startTime, endTime } = req.body;
    if (!title || !startTime || !endTime) {
      return res.status(400).json({ success: false, message: "Title, startTime and endTime are required." });
    }
    const contest = await Contest.create({
      title,
      description: description || null,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      createdById: req.user.id,
    });
    return res.status(201).json({ success: true, data: contest });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.submit = async (req, res) => {
  try {
    const { questionId, code, language, status, score } = req.body;
    const contestId = parseInt(req.params.id, 10);
    if (!questionId) return res.status(400).json({ success: false, message: "questionId is required." });
    const submission = await ContestSubmission.create({
      contestId,
      userId: req.user.id,
      questionId,
      code: code || null,
      language: language || null,
      status: status || "pending",
      score: score != null ? score : null,
    });
    return res.status(201).json({ success: true, data: submission });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
