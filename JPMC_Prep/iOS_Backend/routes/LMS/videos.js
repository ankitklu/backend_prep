const express = require("express")
const router = express.Router()
const Video = require("../../models/LMS/Video")
const Topic = require("../../models/LMS/Topic")

// Get all videos
router.get("/", async (req, res) => {
  try {
    const videos = await Video.find().populate("topic", "name").sort({ createdAt: -1 })
    res.json(videos)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get video by ID
router.get("/:id", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate("topic", "name")
    if (!video) {
      return res.status(404).json({ error: "Video not found" }) 
    }
    res.json(video)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create new video
router.post("/", async (req, res) => {
  console.log("Creating video with data:", req.body)
  try {
    const video = new Video(req.body)
    await video.save()

    // Add video to topic
    await Topic.findByIdAndUpdate(req.body.topic, { $push: { videos: video._id } })

    const populatedVideo = await Video.findById(video._id).populate("topic", "name")
    res.status(201).json(populatedVideo)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Update video
router.put("/:id", async (req, res) => {
  try {
    const oldVideo = await Video.findById(req.params.id)
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("topic", "name")

    if (!video) {
      return res.status(404).json({ error: "Video not found" })
    }

    // Update topic references if topic changed
    if (oldVideo.topic.toString() !== req.body.topic) {
      await Topic.findByIdAndUpdate(oldVideo.topic, { $pull: { videos: video._id } })
      await Topic.findByIdAndUpdate(req.body.topic, { $push: { videos: video._id } })
    }

    res.json(video)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Delete video
router.delete("/:id", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
    if (!video) {
      return res.status(404).json({ error: "Video not found" })
    }

    // Remove from topic
    await Topic.findByIdAndUpdate(video.topic, { $pull: { videos: video._id } })

    await Video.findByIdAndDelete(req.params.id)
    res.json({ message: "Video deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get videos by topic
router.get("/topic/:topicId", async (req, res) => {
  try {
    const videos = await Video.find({ topic: req.params.topicId }).populate("topic", "name").sort({ createdAt: -1 })
    res.json(videos)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get videos by language
router.get("/language/:lang", async (req, res) => {
  try {
    const videos = await Video.find({ language: req.params.lang }).populate("topic", "name").sort({ createdAt: -1 })
    res.json(videos)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
