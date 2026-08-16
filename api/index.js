let app;
let db;

try {
  app = require("../backend/server");
  db = require("../backend/config/db");
} catch (err) {
  console.error("Vercel module load error:", err);
}

let isSynced = false;

module.exports = async (req, res) => {
  try {
    if (!app || !db) {
      app = require("../backend/server");
      db = require("../backend/config/db");
    }
    if (!isSynced && db) {
      await db.connectDB();
      await db.sequelize.sync();
      isSynced = true;
    }
    return app(req, res);
  } catch (err) {
    console.error("Vercel Serverless Function error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Serverless Function Execution Error",
    });
  }
};
