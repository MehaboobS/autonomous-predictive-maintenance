const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({

  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }

});

const sendServiceWelcomeMail = async (email, center) => {

  await transporter.sendMail({

    from: `"AutoSentinel AI" <${process.env.EMAIL_USER}>`,
    to: email,

    subject: "🚗 Welcome to AutoSentinel Service Network",

    html: `
    
    <div style="font-family:Arial;padding:20px;background:#0f172a;color:white">

      <h2 style="color:#facc15">
        Welcome to AutoSentinel AI Service Network
      </h2>

      <p>
        Your service center <b>${center}</b> has been successfully onboarded.
      </p>

      <p>
        You can now receive predictive maintenance service requests
        from vehicle owners in your region.
      </p>

      <div style="margin-top:20px;padding:15px;background:#1e293b;border-radius:8px">
        
        <h3 style="color:#facc15">What you can do now</h3>

        <ul>
          <li>Receive vehicle repair requests</li>
          <li>Manage appointment schedules</li>
          <li>Track predictive maintenance alerts</li>
          <li>Improve service efficiency</li>
        </ul>

      </div>

      <p style="margin-top:20px">
        We are excited to have you in the AutoSentinel ecosystem.
      </p>

      <p style="color:#94a3b8">
        — AutoSentinel AI Team
      </p>

    </div>
    
    `
  });

};

module.exports = sendServiceWelcomeMail;