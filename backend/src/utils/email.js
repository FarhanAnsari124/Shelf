const Brevo = require("@getbrevo/brevo");

const apiInstance = new Brevo.TransactionalEmailsApi();

const sendOTP = async (email, otp) => {
  try {
    apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

    const sendSmtpEmail = new Brevo.SendSmtpEmail();
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
