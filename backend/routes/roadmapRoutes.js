const express = require("express");
const router = express.Router();
const roadmapController = require("../controllers/roadmapController");
const { authenticate, requireRole } = require("../middleware/auth");

router.get("/", authenticate, roadmapController.list);
router.get("/progress", authenticate, roadmapController.getProgress);
router.put("/progress/:id", authenticate, roadmapController.updateProgress);
router.post("/progress/sync", authenticate, roadmapController.syncProgress);
router.post("/", authenticate, requireRole(["faculty", "admin"]), roadmapController.create);

module.exports = router;
