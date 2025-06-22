const express = require("express")
const router = express.Router()
const Topic = require("../../models/LMS/Topic")
const Video = require("../../models/LMS/Video")

// Get all topics
router.get("/", async (req, res) => {
  try {
    const topics = await Topic.find().populate("videos", "title").sort({ createdAt: -1 })
    res.json(topics)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get topic by ID
router.get("/:id", async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id).populate("videos")
    if (!topic) {
      return res.status(404).json({ error: "Topic not found" })
    }
    res.json(topic)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create new topic
router.post("/", async (req, res) => {
  try {
    const topic = new Topic(req.body)
    await topic.save()
    res.status(201).json(topic)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Update topic
router.put("/:id", async (req, res) => {
  try {
    const topic = await Topic.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("videos", "title")

    if (!topic) {
      return res.status(404).json({ error: "Topic not found" })
    }

    res.json(topic)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Delete topic
router.delete("/:id", async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id)
    if (!topic) {
      return res.status(404).json({ error: "Topic not found" })
    }

    // Check if topic has videos
    const videoCount = await Video.countDocuments({ topic: req.params.id })
    if (videoCount > 0) {
      return res.status(400).json({
        error: "Cannot delete topic with associated videos",
      })
    }

    await Topic.findByIdAndDelete(req.params.id)
    res.json({ message: "Topic deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
