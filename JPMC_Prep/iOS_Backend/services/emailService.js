const nodemailer = require("nodemailer")

// Configure email transporter (using Gmail as example)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

const sendEmail = async ({ recipients, subject, message, meetingDetails, type }) => {
  try {
    let emailContent = message

    // Add meeting details for invitations
    if (type === "invitation" && meetingDetails) {
      emailContent += `\n\n--- Meeting Details ---\n`
      emailContent += `Title: ${meetingDetails.title}\n`
      emailContent += `Date: ${new Date(meetingDetails.date).toLocaleString()}\n`
      emailContent += `Duration: ${meetingDetails.duration} minutes\n`
      if (meetingDetails.description) {
        emailContent += `Description: ${meetingDetails.description}\n`
      }
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipients.join(", "),
      subject: subject,
      text: emailContent,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">${subject}</h2>
          <p style="line-height: 1.6;">${message.replace(/\n/g, "<br>")}</p>
          ${
            type === "invitation" && meetingDetails
              ? `
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Meeting Details</h3>
              <p><strong>Title:</strong> ${meetingDetails.title}</p>
              <p><strong>Date:</strong> ${new Date(meetingDetails.date).toLocaleString()}</p>
              <p><strong>Duration:</strong> ${meetingDetails.duration} minutes</p>
              ${meetingDetails.description ? `<p><strong>Description:</strong> ${meetingDetails.description}</p>` : ""}
            </div>
          `
              : ""
          }
        </div>
      `,
    }

    const result = await transporter.sendMail(mailOptions)
    console.log("Email sent successfully:", result.messageId)
    return result
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
}

module.exports = {
  sendEmail,
}
