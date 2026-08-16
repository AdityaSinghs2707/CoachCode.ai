const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Note = sequelize.define(
  "Note",
  {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    folderId: { type: DataTypes.INTEGER },
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT },
  },
  { timestamps: true }
);

module.exports = Note;
