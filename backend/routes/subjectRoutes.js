const express = require("express");
const router = express.Router();
const subjectController = require("../controllers/subjectController");
const { authenticate, requireRole } = require("../middleware/auth");

router.get("/", authenticate, subjectController.list);
router.post("/", authenticate, requireRole(["admin", "faculty"]), subjectController.create);

module.exports = router;
