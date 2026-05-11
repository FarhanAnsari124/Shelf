const express = require("express");
const { register, verifyOTP, login, getMe } = require("./auth.controller");
const { protect } = require("../../middlewares/auth.middleware");

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.get("/me", protect, getMe);

module.exports = router;
