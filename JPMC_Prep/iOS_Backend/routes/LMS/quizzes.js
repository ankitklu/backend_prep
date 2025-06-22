const express = require("express")
const router = express.Router()
const Quiz = require("../../models/LMS/Quiz")
const Video = require("../../models/LMS/Video")

// Get quiz by video ID
router.get("/video/:videoId", async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ videoId: req.params.videoId })
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" })
    }
    res.json(quiz)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Generate quiz using GROQ
router.post("/generate", async (req, res) => {
  try {
    const { videoId, videoTitle, videoDescription, topic } = req.body

    // Mock GROQ API call - replace with actual GROQ integration
    const mockQuizQuestions = [
      {
        question: `What is the main topic covered in "${videoTitle}"?`,
        options: [
          "Basic farming techniques",
          "Advanced crop management",
          "Soil preparation methods",
          "Irrigation systems",
        ],
        correctAnswer: 1,
      },
      {
        question: "Which of the following is most important for crop growth?",
        options: ["Proper lighting only", "Water and nutrients", "Temperature control only", "Pest control only"],
        correctAnswer: 1,
      },
      {
        question: "Based on the video content, what should farmers prioritize?",
        options: ["Quick profits", "Sustainable practices", "Maximum yield only", "Minimal effort"],
        correctAnswer: 1,
      },
    ]

    const quiz = new Quiz({
      videoId,
      questions: mockQuizQuestions,
    })

    await quiz.save()
    res.status(201).json(quiz)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Update quiz
router.put("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true })

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" })
    }

    res.json(quiz)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Delete quiz
router.delete("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id)
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" })
    }
    res.json({ message: "Quiz deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
