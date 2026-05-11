const axios = require("axios");

const sendOTP = async (email, otp) => {
  try {
    const data = {
      sender: { 
        name: "SHELF Marketplace", 
        email: process.env.BREVO_SENDER_EMAIL || "farhan.knp121@gmail.com" 
      },
      to: [{ email: email }],
      subject: "Your OTP for SHELF Verification",
      htmlContent: `<html><body><b>Your verification code is ${otp}</b><p>It expires in 10 minutes.</p></body></html>`
    };

    const config = {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
        "accept": "application/json"
      }
    };

    await axios.post("https://api.brevo.com/v3/smtp/email", data, config);
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = { sendOTP };
