require("dotenv").config();
const { Sequelize } = require("sequelize");
const path = require("path");

let sequelize;

if (process.env.VERCEL || process.env.NOW_REGION) {
  // Use in-memory SQLite on Vercel serverless functions for 100% reliable zero-config demo mode
  sequelize = new Sequelize({
    dialect: "sqlite",
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
      logging: false,
    }
  );
} else {
  // Use local file SQLite for local development
  sequelize = new Sequelize({
    dialect: "sqlite",
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