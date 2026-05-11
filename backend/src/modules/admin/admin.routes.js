const express = require("express");
const router = express.Router();
const { getStats, getAllUsers } = require("./admin.controller");
const { protect } = require("../../middlewares/auth.middleware");

router.get("/stats", protect, getStats);
router.get("/users", protect, getAllUsers);

module.exports = router;
