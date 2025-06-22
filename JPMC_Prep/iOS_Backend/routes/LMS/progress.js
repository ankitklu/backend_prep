const express = require("express")
const router = express.Router()
const UserProgress = require("../../models/LMS/UserProgress")
const User = require("../../models/User")
const Video = require("../../models/LMS/Video")
const Topic = require("../../models/LMS/Topic")

// Get user progress
router.get("/user/:userId", async (req, res) => {
  try {
    const progress = await UserProgress.find({ userId: req.params.userId })
      .populate("videoId", "title duration topic")
      .sort({ createdAt: -1 })
    res.json(progress)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create or update progress
router.post("/", async (req, res) => {
  try {
    const { userId, videoId, completed, score } = req.body

    const progressData = {
      userId,
      videoId,
      completed,
      score,
      completedAt: completed ? new Date() : null,
    }

    const progress = await UserProgress.findOneAndUpdate({ userId, videoId }, progressData, { upsert: true, new: true })

    res.json(progress)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Get analytics/stats
router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalVideos = await Video.countDocuments()

    // Calculate completion rate
    const totalProgress = await UserProgress.countDocuments()
    const completedProgress = await UserProgress.countDocuments({ completed: true })
    const completionRate = totalProgress > 0 ? (completedProgress / totalProgress) * 100 : 0

    // Calculate average score
    const progressWithScores = await UserProgress.find({ score: { $exists: true } })
    const averageScore =
      progressWithScores.length > 0
        ? progressWithScores.reduce((sum, p) => sum + p.score, 0) / progressWithScores.length
        : 0

    // Topic progress
    const topics = await Topic.find().populate("videos")
    const topicProgress = await Promise.all(
      topics.map(async (topic) => {
        const topicVideos = topic.videos.length
        const completedInTopic = await UserProgress.countDocuments({
          videoId: { $in: topic.videos },
          completed: true,
        })

        return {
          topic: topic.name,
          completed: completedInTopic,
          total: topicVideos * totalUsers,
        }
      }),
    )

    // User progress
    const users = await User.find()
    const userProgress = await Promise.all(
      users.map(async (user) => {
        const userProgressData = await UserProgress.find({ userId: user._id })
        const completedVideos = userProgressData.filter((p) => p.completed).length
        const totalScore = userProgressData.filter((p) => p.score).reduce((sum, p) => sum + p.score, 0)

        return {
          userName: user.name,
          completedVideos,
          totalScore: Math.round(totalScore),
        }
      }),
    )

    const stats = {
      totalUsers,
      totalVideos,
      completionRate,
      averageScore,
      topicProgress,
      userProgress: userProgress.sort((a, b) => b.completedVideos - a.completedVideos),
    }

    res.json(stats)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get progress by video
router.get("/video/:videoId", async (req, res) => {
  try {
    const progress = await UserProgress.find({ videoId: req.params.videoId })
      .populate("userId", "name phone location")
      .sort({ createdAt: -1 })
    res.json(progress)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
