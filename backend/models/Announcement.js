const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Announcement = sequelize.define(
  "Announcement",
  {
    title: { type: DataTypes.STRING, allowNull: false },
    body: { type: DataTypes.TEXT, allowNull: false },
    createdById: { type: DataTypes.INTEGER, allowNull: false },
  },
  { timestamps: true }
);

module.exports = Announcement;
