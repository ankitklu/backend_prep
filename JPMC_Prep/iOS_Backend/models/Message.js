const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["invitation", "announcement"],
      required: true,
    },
    meetingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Meeting",
    },
    recipients: [
      {
        type: String,
        required: true,
      },
    ],
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    channels: {
      email: {
        type: Boolean,
        default: true,
      },
      whatsapp: {
        type: Boolean,
        default: false,
      },
    },
    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Message", messageSchema)
