const express = require("express");
const router = express.Router();
const noteController = require("../controllers/noteController");
const { authenticate, requireRole } = require("../middleware/auth");

router.use(authenticate, requireRole(["student"]));
router.get("/", noteController.list);
router.get("/:id", noteController.getById);
router.post("/", noteController.create);
router.put("/:id", noteController.update);
router.delete("/:id", noteController.remove);

module.exports = router;
