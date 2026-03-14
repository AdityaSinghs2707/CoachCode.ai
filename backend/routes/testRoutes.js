const express = require("express");
const router = express.Router();
const testController = require("../controllers/testController");
const { authenticate, requireRole } = require("../middleware/auth");

router.get("/", authenticate, testController.list);
router.get("/:id", authenticate, testController.getById);
router.post("/", authenticate, requireRole(["faculty", "admin"]), testController.create);
router.put("/:id", authenticate, requireRole(["faculty", "admin"]), testController.update);
router.delete("/:id", authenticate, requireRole(["faculty", "admin"]), testController.remove);
router.post("/:id/attempt", authenticate, requireRole(["student"]), testController.startAttempt);
router.post("/:id/submit", authenticate, requireRole(["student"]), testController.submitAttempt);

module.exports = router;
