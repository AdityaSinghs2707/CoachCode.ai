const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Question = sequelize.define(
  "Question",
  {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    type: {
      type: DataTypes.ENUM("coding", "theory"),
      defaultValue: "coding",
    },
    difficulty: {
      type: DataTypes.ENUM("easy", "medium", "hard"),
      defaultValue: "medium",
    },
    companyTag: { type: DataTypes.STRING },
    starterCode: { type: DataTypes.TEXT },
    solutionCode: { type: DataTypes.TEXT },
    subjectId: { type: DataTypes.INTEGER },
    createdById: { type: DataTypes.INTEGER, allowNull: false },
  },
  { timestamps: true }
);

module.exports = Question;
