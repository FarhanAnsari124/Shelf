const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendOTP = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `"SHELF Campus Marketplace" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your OTP for SHELF Verification",
      text: `Your verification code is ${otp}. It expires in 10 minutes.`,
      html: `<b>Your verification code is ${otp}</b><p>It expires in 10 minutes.</p>`,
    });
    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
};

module.exports = { sendOTP };
