const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const RoadmapProgress = sequelize.define(
  "RoadmapProgress",
  {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    roadmapId: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.ENUM("not_started", "in_progress", "completed"),
      defaultValue: "not_started",
    },
    completedAt: { type: DataTypes.DATE },
  },
  { timestamps: true }
);

module.exports = RoadmapProgress;
