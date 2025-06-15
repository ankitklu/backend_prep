// WhatsApp service using Twilio WhatsApp API
const twilio = require("twilio")

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

const sendWhatsApp = async ({ recipients, message, meetingDetails, type }) => {
  try {
    let whatsappMessage = message

    // Add meeting details for invitations
    if (type === "invitation" && meetingDetails) {
      whatsappMessage += `\n\n*Meeting Details*\n`
      whatsappMessage += `*Title:* ${meetingDetails.title}\n`
      whatsappMessage += `*Date:* ${new Date(meetingDetails.date).toLocaleString()}\n`
      whatsappMessage += `*Duration:* ${meetingDetails.duration} minutes\n`
      if (meetingDetails.description) {
        whatsappMessage += `*Description:* ${meetingDetails.description}\n`
      }
    }

    const sendPromises = recipients.map((recipient) => {
      // Format phone number for WhatsApp (should start with whatsapp:+)
      const formattedNumber = recipient.startsWith("whatsapp:")
        ? recipient
        : `whatsapp:+${recipient.replace(/\D/g, "")}`

      return client.messages.create({
        body: whatsappMessage,
        from: process.env.TWILIO_WHATSAPP_NUMBER,
        to: formattedNumber,
      })
    })

    const results = await Promise.all(sendPromises)
    console.log(
      "WhatsApp messages sent successfully:",
      results.map((r) => r.sid),
    )
    return results
  } catch (error) {
    console.error("Error sending WhatsApp messages:", error)
    throw error
  }
}

// Alternative: Mock WhatsApp service for development
const sendWhatsAppMock = async ({ recipients, message, meetingDetails, type }) => {
  console.log("Mock WhatsApp Service - Message would be sent to:", recipients)
  console.log("Message:", message)
  if (meetingDetails) {
    console.log("Meeting Details:", meetingDetails)
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return { success: true, mock: true }
}

module.exports = {
  sendWhatsApp: process.env.NODE_ENV === "production" ? sendWhatsApp : sendWhatsAppMock,
}
