require("dotenv").config();
const { Sequelize } = require("sequelize");
const path = require("path");

let sequelize;

// On Vercel Serverless, root filesystem is read-only. Writable folder is /tmp
const sqlitePath = process.env.VERCEL
  ? "/tmp/database.sqlite"
  : path.join(__dirname, "../database.sqlite");

if (process.env.DB_HOST && process.env.DB_HOST !== "localhost") {
  // Use Cloud MySQL when DB_HOST is configured (e.g. Aiven / PlanetScale / Render MySQL)
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
  // Use SQLite for local development & Vercel serverless demo mode
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: sqlitePath,
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