const User = require('../models/User');

const chatbotController = async (req, res) => {
  const msg = req.body.Body.trim().toLowerCase();
  const phone = req.body.From;

  let user = await User.findOne({ phone });
  if (!user) {
    user = await User.create({ phone });
  }

  let response = '';

  if (msg === 'hello') {
    response = `👋 Hello! Welcome to [NGO Name]'s Campaign Assistant.\nHave you ever participated in any of our past campaigns?\n\n1️⃣ Yes\n2️⃣ No`;
  }
  else if (msg === '1') {
    if (user.registered) {
      response = `Would you like to join a new campaign?\n\n1️⃣ Yes\n2️⃣ No`;
    } else {
      response = `Please register first using this link: [form-link]\nReply "Done" once completed.`;
    }
  }
  else if (msg === '2') {
    response = `No worries! Please fill this form to get started: [form-link]\nReply "Done" once completed.`;
  }
  else if (msg === 'done') {
    user.registered = true;
    await user.save();
    response = `Thank you for registering! 🎉\nWould you like to join a campaign? (Yes/No)`;
  }
  else if (['yes', 'y'].includes(msg)) {
    response = `Here are our upcoming campaigns:\n\n1. 🌱 Tree Plantation\n2. 🩺 Health Camp\n3. 📚 School Drive\n4. ♀️ Women Workshop\n\nReply with number`;
  }
  else if (['1', '2', '3', '4'].includes(msg)) {
    const campaigns = ['Tree Plantation', 'Health Camp', 'School Drive', 'Women Workshop'];
    const selected = campaigns[parseInt(msg) - 1];
    if (!user.campaigns.includes(selected)) {
      user.campaigns.push(selected);
      await user.save();
    }
    response = `Awesome! You’re registered for the ${selected}.\nWould you like to join another? (Yes/No)`;
  } else {
    response = `Sorry, I didn’t get that. Please reply with a valid option.`;
  }

  return res.send(`<Response><Message>${response}</Message></Response>`);
};

module.exports = chatbotController;
