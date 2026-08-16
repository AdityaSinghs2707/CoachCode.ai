require("dotenv").config();
const { Sequelize } = require("sequelize");
const path = require("path");

let sequelize;

const createSequelizeInstance = () => {
  if (process.env.USE_SQLITE === "true") {
    return new Sequelize({
      dialect: "sqlite",
      storage: path.join(__dirname, "../database.sqlite"),
      logging: false,
    });
  }

  return new Sequelize(
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
};

sequelize = createSequelizeInstance();

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database Connected ✅");
  } catch (error) {
    console.warn("MySQL connection failed, falling back to local SQLite database 🔄...", error.message);
    
    // Fallback to local SQLite so registration & app always work
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: path.join(__dirname, "../database.sqlite"),
      logging: false,
    });

    // Update exported instance methods
    try {
      await sequelize.authenticate();
      console.log("Local SQLite Database Connected ✅");
    } catch (sqliteErr) {
      console.error("Database connection error ❌", sqliteErr);
    }
  }
};

module.exports = {
  get sequelize() {
    return sequelize;
  },
  connectDB,
};