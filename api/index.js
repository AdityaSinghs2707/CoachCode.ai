const app = require("../backend/server");
const db = require("../backend/config/db");

let isInitialized = false;

module.exports = async (req, res) => {
  if (!isInitialized) {
    try {
      await db.connectDB();
      await db.sequelize.sync();
    } catch (err) {
      console.error("Vercel DB Init note:", err.message);
    }
    isInitialized = true;
  }
  return app(req, res);
};
