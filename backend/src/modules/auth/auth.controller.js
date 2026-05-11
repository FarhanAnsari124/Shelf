const User = require("../users/user.model");
const jwt = require("jsonwebtoken");
const { sendOTP } = require("../../utils/email");

const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
const otpStore = new Map();

exports.register = async (req, res, next) => {
  try {
    const { name, rollNumber, email, password } = req.body;
    if (!name || !rollNumber || !email || !password) return res.status(400).json({ success: false, message: "Missing fields" });

    const exists = await User.findOne({ $or: [{ email }, { rollNumber }] });
    if (exists) return res.status(400).json({ success: false, message: "User exists" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, { otp, userData: { name, rollNumber, email, password }, expiresAt: Date.now() + 10 * 60 * 1000 });
    
    const sent = await sendOTP(email, otp);
    if (!sent) return res.status(500).json({ success: false, message: "Failed to send OTP. Please try again later." });

    res.json({ success: true, message: "OTP sent" });
  } catch (e) { next(e); }
};

exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const stored = otpStore.get(email);

    if (!stored || Date.now() > stored.expiresAt) return res.status(400).json({ success: false, message: "Invalid or expired" });
    if (stored.otp !== otp) return res.status(400).json({ success: false, message: "Wrong OTP" });

    const { name, rollNumber, password } = stored.userData;
    const user = await User.create({ name, rollNumber, email, password, isVerified: true });
    otpStore.delete(email);

    res.status(201).json({ success: true, token: genToken(user._id), user });
  } catch (e) { next(e); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ success: false, message: "Invalid credentials" });
    if (!user.isVerified) return res.status(401).json({ success: false, message: "Not verified" });

    res.json({ success: true, token: genToken(user._id), user });
  } catch (e) { next(e); }
};

exports.getMe = async (req, res, next) => {
  try {
    res.json({ success: true, data: await User.findById(req.user.id) });
  } catch (e) { next(e); }
};
