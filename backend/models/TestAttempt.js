const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const TestAttempt = sequelize.define(
  "TestAttempt",
  {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    testId: { type: DataTypes.INTEGER, allowNull: false },
    startedAt: { type: DataTypes.DATE, allowNull: false },
    submittedAt: { type: DataTypes.DATE },
    score: { type: DataTypes.INTEGER },
    totalMarks: { type: DataTypes.INTEGER },
    answers: { type: DataTypes.JSON },
  },
  { timestamps: true }
);

module.exports = TestAttempt;
