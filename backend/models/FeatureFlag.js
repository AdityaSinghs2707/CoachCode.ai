const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const FeatureFlag = sequelize.define(
  "FeatureFlag",
  {
    key: { type: DataTypes.STRING, allowNull: false, unique: true },
    value: { type: DataTypes.BOOLEAN, defaultValue: true },
    description: { type: DataTypes.STRING },
  },
  { timestamps: true }
);

module.exports = FeatureFlag;
