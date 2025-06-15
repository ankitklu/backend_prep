// calendar.ts
import express from "express";
import { scheduleEvent } from "../services/googleCalendar";
const router = express.Router();

router.post("/event", async (req, res) => {
  const { startTime, endTime, summary } = req.body;
  try {
    const event = await scheduleEvent(startTime, endTime, summary);
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
