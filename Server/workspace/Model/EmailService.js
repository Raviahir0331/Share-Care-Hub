const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter object
const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 465,
  secure: true,
  auth: {
    user: process.env.REACT_MAIL_USER,  // Use environment variables for better security
    pass: process.env.REACT_MAIL_PASS
  }
});

// Function to send email
const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.REACT_MAIL_USER,
    to,
    subject,
    text
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };
