const express = require("express");
const router = express.Router();
const announcementController = require("../controllers/announcementController");
const { authenticate, requireRole } = require("../middleware/auth");

router.get("/", authenticate, announcementController.list);
router.post("/", authenticate, requireRole(["faculty", "admin"]), announcementController.create);
router.put("/:id", authenticate, requireRole(["faculty", "admin"]), announcementController.update);
router.delete("/:id", authenticate, requireRole(["faculty", "admin"]), announcementController.remove);

module.exports = router;
