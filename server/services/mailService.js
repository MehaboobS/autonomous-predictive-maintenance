const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({

  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }

});

const sendWelcomeMail = async (email, name) => {

  await transporter.sendMail({

    from: "AutoSentinel AI",
    to: email,

    subject: "Welcome to AutoSentinel AI 🚗",

    html: `
      <h2>Welcome ${name}</h2>
      <p>Your vehicle monitoring platform is ready.</p>
      <p>Start predicting maintenance issues today.</p>
    `
  });

};

module.exports = sendWelcomeMail;