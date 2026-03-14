const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");
const { authenticate, requireRole } = require("../middleware/auth");

router.get("/", authenticate, questionController.list);
router.get("/:id", authenticate, questionController.getById);
router.post("/", authenticate, requireRole(["faculty", "admin"]), questionController.create);
router.put("/:id", authenticate, requireRole(["faculty", "admin"]), questionController.update);
router.delete("/:id", authenticate, requireRole(["faculty", "admin"]), questionController.remove);
router.post("/:id/attempt", authenticate, requireRole(["student"]), questionController.submitAttempt);

module.exports = router;
