const express = require("express");
const router = express.Router();
const bookmarkController = require("../controllers/bookmarkController");
const { authenticate, requireRole } = require("../middleware/auth");

router.use(authenticate, requireRole(["student"]));
router.get("/", bookmarkController.list);
router.post("/", bookmarkController.add);
router.delete("/:id", bookmarkController.remove);

module.exports = router;
