const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendActivationMail = async ({ to, link }) => {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: `Account Activation on ${process.env.API_URL}`,
    html:
      `
        <div>
            <h1>For activation use link below</h1>
            <a href="${link}">${link}</a>
        </div>
      `,
  });
};

const sendRestorePasswordMail = async ({ to, newPassword }) => {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: `Restore Password on ${process.env.API_URL}`,
    text: `New Password: ${newPassword}. Please, change it as fast as you can`,
  });
};


module.exports = {
  sendActivationMail,
  sendRestorePasswordMail,
};
