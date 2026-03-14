const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Bookmark = sequelize.define(
  "Bookmark",
  {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    itemType: {
      type: DataTypes.ENUM("question", "material"),
      allowNull: false,
    },
    itemId: { type: DataTypes.INTEGER, allowNull: false },
  },
  { timestamps: true }
);

module.exports = Bookmark;
