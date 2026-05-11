const SibApiV3Sdk = require("@getbrevo/brevo");

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
let apiKey = apiInstance.authentications["apiKey"];

const sendOTP = async (email, otp) => {
  try {
    apiKey.apiKey = process.env.BREVO_API_KEY;

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = "Your OTP for SHELF Verification";
    sendSmtpEmail.htmlContent = `<html><body><b>Your verification code is ${otp}</b><p>It expires in 10 minutes.</p></body></html>`;
    sendSmtpEmail.sender = { 
      name: "SHELF Marketplace", 
      email: process.env.BREVO_SENDER_EMAIL || "farhan.knp121@gmail.com" 
    };
    sendSmtpEmail.to = [{ email: email }];

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = { sendOTP };
