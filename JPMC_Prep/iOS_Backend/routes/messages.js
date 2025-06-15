const express = require("express")
const router = express.Router()
const messageController = require("../controllers/messageController")

// GET /api/messages - Get all messages
router.get("/", messageController.getAllMessages)

// POST /api/messages/send - Send message
router.post("/send", messageController.sendMessage)

// GET /api/messages/:id - Get message by ID
router.get("/:id", messageController.getMessageById)

// PUT /api/messages/:id/status - Update message status
router.put("/:id/status", messageController.updateMessageStatus)

module.exports = router
