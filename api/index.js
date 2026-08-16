const app = require("../backend/server");
const db = require("../backend/config/db");

let isSynced = false;

module.exports = async (req, res) => {
  try {
    if (!isSynced) {
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
