const Message = require("../models/Message")
const Meeting = require("../models/Meeting")
const emailService = require("../services/emailService")
const whatsappService = require("../services/whatsappService")

// Get all messages
const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().populate("meetingId").sort({ createdAt: -1 })
    res.json(messages)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Send message
const sendMessage = async (req, res) => {
  try {
    const { type, meetingId, recipients, subject, message, channels } = req.body

    // Create message record
    const newMessage = new Message({
      type,
      meetingId: meetingId || undefined,
      recipients,
      subject,
      message,
      channels,
    })

    const savedMessage = await newMessage.save()

    // Get meeting details if it's an invitation
    let meetingDetails = null
    if (type === "invitation" && meetingId) {
      meetingDetails = await Meeting.findById(meetingId)
    }

    // Send messages through selected channels
    const sendPromises = []

    if (channels.email) {
      sendPromises.push(
        emailService.sendEmail({
          recipients,
          subject,
          message,
          meetingDetails,
          type,
        }),
      )
    }

    if (channels.whatsapp) {
      sendPromises.push(
        whatsappService.sendWhatsApp({
          recipients,
          message,
          meetingDetails,
          type,
        }),
      )
    }

    // Wait for all messages to be sent
    try {
      await Promise.all(sendPromises)
      savedMessage.status = "sent"
    } catch (sendError) {
      console.error("Error sending messages:", sendError)
      savedMessage.status = "failed"
    }

    await savedMessage.save()
    res.status(201).json(savedMessage)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Get message by ID
const getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id).populate("meetingId")
    if (!message) {
      return res.status(404).json({ error: "Message not found" })
    }
    res.json(message)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Update message status
const updateMessageStatus = async (req, res) => {
  try {
    const { status } = req.body

    const message = await Message.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true })

    if (!message) {
      return res.status(404).json({ error: "Message not found" })
    }

    res.json(message)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  getAllMessages,
  sendMessage,
  getMessageById,
  updateMessageStatus,
}
