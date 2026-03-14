const { User, Material, Question, QuestionAttempt, Test, TestAttempt } = require("../models");
const { Op } = require("sequelize");

const getDashboardStats = async () => {
  const [totalUsers, totalMaterials, totalQuestions, totalTests, testAttempts] = await Promise.all([
    User.count(),
    Material.count(),
    Question.count(),
    Test.count(),
    TestAttempt.count(),
  ]);

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [newUsersThisWeek, newAttemptsThisWeek] = await Promise.all([
    User.count({ where: { createdAt: { [Op.gte]: weekAgo } } }),
    TestAttempt.count({ where: { startedAt: { [Op.gte]: weekAgo } } }),
  ]);

  const roleCounts = await User.findAll({
    attributes: ["role"],
    raw: true,
  });
  const roleDistribution = roleCounts.reduce((acc, { role }) => {
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});

  return {
    totalUsers,
    totalMaterials,
    totalQuestions,
    totalTests,
    testAttempts,
    newUsersThisWeek,
    newAttemptsThisWeek,
    roleDistribution,
  };
};

const getWeeklyGrowth = async () => {
  const days = 7;
  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    const [users, attempts] = await Promise.all([
      User.count({ where: { createdAt: { [Op.gte]: d, [Op.lt]: next } } }),
      TestAttempt.count({ where: { startedAt: { [Op.gte]: d, [Op.lt]: next } } }),
    ]);
    result.push({ date: d.toISOString().slice(0, 10), users, attempts });
  }
  return result;
};

module.exports = { getDashboardStats, getWeeklyGrowth };
