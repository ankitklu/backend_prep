const Meeting = require("../models/Meeting")

// Get all meetings
const getAllMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find().sort({ date: 1 })
    res.json(meetings)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Get meeting by ID
const getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found" })
    }
    res.json(meeting)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Create new meeting
const createMeeting = async (req, res) => {
  try {
    const { title, description, date, duration, participants } = req.body

    const meeting = new Meeting({
      title,
      description,
      date: new Date(date),
      duration,
      participants,
    })

    const savedMeeting = await meeting.save()
    res.status(201).json(savedMeeting)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Update meeting
const updateMeeting = async (req, res) => {
  try {
    const { title, description, date, duration, participants, status } = req.body

    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        date: date ? new Date(date) : undefined,
        duration,
        participants,
        status,
      },
      { new: true, runValidators: true },
    )

    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found" })
    }

    res.json(meeting)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Delete meeting
const deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndDelete(req.params.id)
    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found" })
    }
    res.json({ message: "Meeting deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Get meetings by date
const getMeetingsByDate = async (req, res) => {
  try {
    const date = new Date(req.params.date)
    const nextDay = new Date(date)
    nextDay.setDate(date.getDate() + 1)

    const meetings = await Meeting.find({
      date: {
        $gte: date,
        $lt: nextDay,
      },
    }).sort({ date: 1 })

    res.json(meetings)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  getAllMeetings,
  getMeetingById,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  getMeetingsByDate,
}
