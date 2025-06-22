const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const User = require('../models/User');
const Campaign = require('../models/Campaign');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

router.post('/', async (req, res) => {
  const from = req.body.From;
  const message = req.body.Body.trim().toLowerCase();

  let user = await User.findOne({ phone: from });

  if (!user) {
    user = new User({ phone: from, hasParticipated: false });
    await user.save();
    return sendMessage(from, `Welcome! Have you participated in any campaign before? (yes/no)`);
  }

  if (!user.hasParticipated) {
    if (message === 'yes') {
      user.hasParticipated = true;
      await user.save();
      const campaigns = await Campaign.find({});
      const upcoming = campaigns.map(c => `- ${c.title}: ${c.date}`).join('\n');
      return sendMessage(from, `Great! Here are upcoming campaigns:\n${upcoming}`);
    } else if (message === 'no') {
      return sendMessage(from, `No worries! Would you like to join one? Visit our website.`);
    } else {
      return sendMessage(from, `Please reply with "yes" or "no".`);
    }
  }

  return sendMessage(from, `Thanks for staying connected!`);
});

async function sendMessage(to, message) {
  await client.messages.create({
    body: message,
    from: process.env.TWILIO_WHATSAPP_NUMBER,
    to,
  });
}

module.exports = router;
