const mongoose = require("mongoose")

const quizQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
      required: true,
    },
  ],
  correctAnswer: {
    type: Number,
    required: true,
  },
})

const quizSchema = new mongoose.Schema(
  {
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    questions: [quizQuestionSchema],
  },
  { timestamps: true },
)

module.exports = mongoose.model("Quiz", quizSchema)
