require("dotenv").config();
const { Sequelize } = require("sequelize");
const path = require("path");

let sequelize;

if (process.env.USE_SQLITE === "true" || process.env.NODE_ENV !== "production") {
  // Use SQLite for local development so no local MySQL installation or password issues occur
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: path.join(__dirname, "../database.sqlite"),
    logging: false,
  });
} else {
  // Use MySQL for production deployment (Render / AWS / GCP)
  sequelize = new Sequelize(
    process.env.DB_NAME || "coachcode",
    process.env.DB_USER || "root",
    process.env.DB_PASSWORD || "",
    {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 3306,
      dialect: "mysql",
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