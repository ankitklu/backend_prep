const mongoose = require("mongoose")

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    language: {
      type: String,
      required: true,
      default: "en",
    },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },
    duration: {
      type: Number,
      required: true, // in minutes
    },
    thumbnail: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Video", videoSchema)
