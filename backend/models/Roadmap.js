const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Roadmap = sequelize.define(
  "Roadmap",
  {
    subjectId: { type: DataTypes.INTEGER },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    orderIndex: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { timestamps: true }
);

module.exports = Roadmap;
