const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const QuestionAttempt = sequelize.define(
  "QuestionAttempt",
  {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    questionId: { type: DataTypes.INTEGER, allowNull: false },
    code: { type: DataTypes.TEXT },
    language: { type: DataTypes.STRING },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "wrong", "error"),
      defaultValue: "pending",
    },
    score: { type: DataTypes.INTEGER },
    submittedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { timestamps: true }
);

module.exports = QuestionAttempt;
