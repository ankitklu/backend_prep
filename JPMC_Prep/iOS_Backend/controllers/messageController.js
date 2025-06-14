import Message from '../models/Message.js';
import { sendEmail, sendWhatsApp } from '../services/notificationService.js';

export const sendMessage = async (req, res) => {
  try {
    const { message, recipients, meetingId } = req.body;

    // send email
    await sendEmail(recipients, message);
    // send WhatsApp
    await sendWhatsApp(recipients, message);

    const saved = await Message.create({
      message,
      recipients,
      channels: ['email', 'whatsapp'],
      meetingId
    });

    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error sending message');
  }
};

export const getMessages = async (req, res) => {
  const messages = await Message.find().sort({ sentAt: -1 });
  res.json(messages);
};
