const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
// Load environment variables from .env file
dotenv.config();
const fs= require("fs");

async function updateTemplateHelper(templatePath, toReplaceObject) {
    let templateContent = await fs.promises.readFile(templatePath, "utf-8");
    const keyArrs = Object.keys(toReplaceObject);
    
    keyArrs.forEach((key) => {
        const regex = new RegExp(`#{${key}}`, 'g'); // Use 'g' flag to replace all occurrences
        templateContent = templateContent.replace(regex, toReplaceObject[key]);
    });
    
    return templateContent;
}

async function emailSender(templatePath, recieverEmail, toReplaceObject) {

    const content = await updateTemplateHelper(templatePath, toReplaceObject);

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,  // Accessing the email from the .env file
        pass: process.env.GMAIL_PASS   // Accessing the password from the .env file
      }
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,   // Email from .env
      to: recieverEmail, // Recipient email
      subject: 'Test Email',
      text: 'Hello from Nodemailer!',
      html: content
    };

    // Sending the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);

  } catch (error) {
    console.error('Error occurred while sending email:', error);
  }
}

// const toReplaceObject={
//     name: "Ankit",
//     otp:"2004"

// }

// // Call the function
// // await emailService(templatePath, recieverEmail, toReplaceObject);
// emailService("./Templates/otp.html", "ankit.klu.2022@gmail.com", toReplaceObject)
// .then(()=>{
//     console.log("Email is sent");
// });

module.exports= emailSender;
