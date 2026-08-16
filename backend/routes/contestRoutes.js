const express = require("express");
const router = express.Router();
const contestController = require("../controllers/contestController");
const { authenticate, requireRole } = require("../middleware/auth");

router.get("/", authenticate, contestController.list);
router.get("/:id", authenticate, contestController.getById);
router.get("/:id/leaderboard", authenticate, contestController.leaderboard);
router.post("/", authenticate, requireRole(["faculty", "admin"]), contestController.create);
router.post("/:id/submit", authenticate, requireRole(["student"]), contestController.submit);

module.exports = router;
