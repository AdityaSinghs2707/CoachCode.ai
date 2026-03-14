const express = require("express");
const router = express.Router();
const compilerController = require("../controllers/compilerController");
const { authenticate } = require("../middleware/auth");
const { compilerLimiter } = require("../middleware/security");

router.get("/languages", compilerController.languages);
router.post("/execute", authenticate, compilerLimiter, compilerController.execute);

module.exports = router;
