require("dotenv").config();
const { Sequelize } = require("sequelize");
const path = require("path");

let sqlite3;
try {
  sqlite3 = require("sqlite3");
} catch (e) {
  console.warn("sqlite3 module note:", e.message);
}

let mysql2;
try {
  mysql2 = require("mysql2");
} catch (e) {
  console.warn("mysql2 module note:", e.message);
}

let sequelize;

if (process.env.DB_HOST && process.env.DB_HOST !== "localhost") {
  // Use Cloud MySQL when DB_HOST is configured
  sequelize = new Sequelize(
    process.env.DB_NAME || "coachcode",
    process.env.DB_USER || "root",
    process.env.DB_PASSWORD || "",
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      dialect: "mysql",
      dialectModule: mysql2 || undefined,
      logging: false,
    }
  );
} else {
  // Use SQLite for local development & Vercel serverless demo
  const isVercel = Boolean(process.env.VERCEL || process.env.NOW_REGION);
  sequelize = new Sequelize({
    dialect: "sqlite",
    dialectModule: sqlite3 || undefined,
    storage: isVercel ? ":memory:" : path.join(__dirname, "../database.sqlite"),
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