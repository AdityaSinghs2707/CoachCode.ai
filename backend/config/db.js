require("dotenv").config();
const { Sequelize } = require("sequelize");
const path = require("path");
const sqlite3 = require("sqlite3");
const mysql2 = require("mysql2");

let sequelize;

if (process.env.VERCEL || process.env.NOW_REGION) {
  // Use in-memory SQLite with explicit dialectModule for Vercel serverless bundling
  sequelize = new Sequelize({
    dialect: "sqlite",
    dialectModule: sqlite3,
    storage: ":memory:",
    logging: false,
  });
} else if (process.env.DB_HOST && process.env.DB_HOST !== "localhost") {
  // Use Cloud MySQL when DB_HOST is configured
  sequelize = new Sequelize(
    process.env.DB_NAME || "coachcode",
    process.env.DB_USER || "root",
    process.env.DB_PASSWORD || "",
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      dialect: "mysql",
      dialectModule: mysql2,
      logging: false,
    }
  );
} else {
  // Use local file SQLite for local development
  sequelize = new Sequelize({
    dialect: "sqlite",
    dialectModule: sqlite3,
    storage: path.join(__dirname, "../database.sqlite"),
    logging: false,
  });
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`Database Connected (${sequelize.getDialect().toUpperCase()}) ✅`);
  } catch (error) {
    console.error("Database connection error ❌", error.message);
  }
};

module.exports = {
  sequelize,
  connectDB,
};