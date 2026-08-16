const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const NoteFolder = sequelize.define(
  "NoteFolder",
  {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    parentId: { type: DataTypes.INTEGER },
  },
  { timestamps: true }
);

module.exports = NoteFolder;
