const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER, // Accessing the email from the .env file
    pass: process.env.GMAIL_PASS, // Accessing the password from the .env file
  },
});

const mailOptions = {
  from: process.env.GMAIL_USER, // Email from .env
  to: "ankit.klu.2022@gmail.com", // Recipient email
  subject: "Test Email",
  text: "Hello from Nodemailer!",
  html: "<strong>Email sent with HTML tags</strong>",
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log(error);
  }
  console.log("Email sent: " + info.response);
});

// Create the transporter with Gmail and environment variables for credentials
