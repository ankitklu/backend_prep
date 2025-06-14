// messages.ts
import express from "express";
import Message from "../models/Message";
import { sendEmail } from "../services/email";
import { sendWhatsApp } from "../services/whatsapp";
const router = express.Router();

router.post("/", async (req, res) => {
  const { toAdmins, toVolunteers, text } = req.body;
  // Mock phone/email lists
//   const adminEmails = [...]; const volunteerEmails = [...];
//   const adminPhones = [...]; const volunteerPhones = [...];

  let emailList = []; let phoneList = [];

  if (toAdmins) { emailList.push(...adminEmails); phoneList.push(...adminPhones); }
  if (toVolunteers) { emailList.push(...volunteerEmails); phoneList.push(...volunteerPhones); }

  const emailResult = await sendEmail(emailList, "Meeting Message", text);
  for (const phone of phoneList) await sendWhatsApp(phone, text);

  const message = await Message.create({
    toAdmins, toVolunteers, text,
    emailSent: true, whatsappSent: true
  });
  res.json({ message, emailResult });
});

router.get("/", async (req, res) => {
  const history = await Message.find().sort({ timestamp: -1 });
  res.json(history);
});

export default router;
