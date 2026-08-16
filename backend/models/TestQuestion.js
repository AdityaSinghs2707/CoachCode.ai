const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const TestQuestion = sequelize.define(
  "TestQuestion",
  {
    testId: { type: DataTypes.INTEGER, allowNull: false },
    questionId: { type: DataTypes.INTEGER, allowNull: false },
    orderIndex: { type: DataTypes.INTEGER, defaultValue: 0 },
    marks: { type: DataTypes.INTEGER, defaultValue: 1 },
  },
  { timestamps: false }
);

module.exports = TestQuestion;
