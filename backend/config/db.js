require("dotenv").config();
const { Sequelize } = require("sequelize");
const path = require("path");

const isVercel = Boolean(process.env.VERCEL || process.env.NOW_REGION);

let sqlite3;
if (!isVercel) {
  try {
    sqlite3 = require("sqlite3");
  } catch (e) {}
}

const mysql2 = require("mysql2");

let sequelize;

if (process.env.DB_HOST && process.env.DB_HOST !== "localhost") {
  // Pure JavaScript MySQL Driver (100% Vercel Serverless Compatible - No C++ addon errors)
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
} else if (!isVercel && sqlite3) {
  // Local Mac development using local file SQLite
  sequelize = new Sequelize({
    dialect: "sqlite",
    dialectModule: sqlite3,
    storage: path.join(__dirname, "../database.sqlite"),
    logging: false,
  });
} else {
  // Vercel Serverless environment using Pure JS mysql2 driver
  sequelize = new Sequelize(
    process.env.DB_NAME || "coachcode",
    process.env.DB_USER || "root",
    process.env.DB_PASSWORD || "",
    {
      host: process.env.DB_HOST || "127.0.0.1",
      port: process.env.DB_PORT || 3306,
      dialect: "mysql",
      dialectModule: mysql2,
      logging: false,
    }
  );
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