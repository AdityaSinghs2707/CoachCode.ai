const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Subject = sequelize.define(
  "Subject",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.TEXT },
  },
  { timestamps: true }
);

module.exports = Subject;
