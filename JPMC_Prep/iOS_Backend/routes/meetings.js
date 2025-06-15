const express = require("express")
const router = express.Router()
const meetingController = require("../controllers/meetingController")

// GET /api/meetings - Get all meetings
router.get("/", meetingController.getAllMeetings)

// GET /api/meetings/:id - Get meeting by ID
router.get("/:id", meetingController.getMeetingById)

// POST /api/meetings - Create new meeting
router.post("/", meetingController.createMeeting)

// PUT /api/meetings/:id - Update meeting
router.put("/:id", meetingController.updateMeeting)

// DELETE /api/meetings/:id - Delete meeting
router.delete("/:id", meetingController.deleteMeeting)

// GET /api/meetings/date/:date - Get meetings by date
router.get("/date/:date", meetingController.getMeetingsByDate)

module.exports = router
