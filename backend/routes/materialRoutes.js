const express = require("express");
const router = express.Router();
const materialController = require("../controllers/materialController");
const { authenticate, requireRole } = require("../middleware/auth");
const upload  = require("../config/multer");

router.get("/", authenticate, materialController.list);
router.get("/:id", authenticate, materialController.getById);
router.post("/", upload.single("file"), materialController.upload);
router.put("/:id", authenticate, requireRole(["faculty", "admin"]), upload.single("file"), materialController.update);
router.delete("/:id", authenticate, requireRole(["faculty", "admin"]), materialController.remove);

module.exports = router;
