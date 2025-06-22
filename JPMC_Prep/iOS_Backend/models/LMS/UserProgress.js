const mongoose = require("mongoose")

const userProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    score: {
      type: Number,
      required: false, // quiz score percentage
    },
    completedAt: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true },
)

// Ensure unique progress per user per video
userProgressSchema.index({ userId: 1, videoId: 1 }, { unique: true })

module.exports = mongoose.model("UserProgress", userProgressSchema)
