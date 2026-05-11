const express = require("express");
const router = express.Router();
const { getStats } = require("./admin.controller");
const { protect } = require("../../middlewares/auth.middleware");

// In a real app, you'd add an admin-check middleware here too
router.get("/stats", protect, getStats);

module.exports = router;
