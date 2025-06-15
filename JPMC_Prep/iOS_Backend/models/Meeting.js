const mongoose = require("mongoose")

const meetingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      default: 60,
    },
    participants: [
      {
        type: String,
        required: true,
      },
    ],
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Meeting", meetingSchema)
