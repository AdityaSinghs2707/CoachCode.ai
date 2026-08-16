const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Material = sequelize.define(
  "Material",
  {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    fileUrl: { type: DataTypes.STRING, allowNull: false },
    fileType: {
      type: DataTypes.ENUM("pdf", "ppt", "doc", "other"),
      defaultValue: "other",
    },
    subjectId: { type: DataTypes.INTEGER, allowNull: false },
    uploadedById: { type: DataTypes.INTEGER, allowNull: true },
  },
  { timestamps: true }
);

module.exports = Material;
