const nodemailer = require('nodemailer');

// Create a nodemailer transporter
exports.transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USERNAME_NODEMAILER,
    pass: process.env.PASSWORD_NODEMAILER,
  },
});

// Replace 'your_email@gmail.com' and 'your_email_password' with your Gmail credentials
