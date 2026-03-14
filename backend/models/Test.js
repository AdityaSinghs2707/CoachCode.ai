const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Test = sequelize.define(
  "Test",
  {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    durationMinutes: { type: DataTypes.INTEGER, allowNull: false },
    createdById: { type: DataTypes.INTEGER, allowNull: false },
  },
  { timestamps: true }
);

module.exports = Test;
