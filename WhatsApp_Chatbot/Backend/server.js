const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Campaign = require('./models/Campaign');

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const whatsappRoutes = require('./routes/whatsapp');
app.use('/webhook', whatsappRoutes);

// ✅ Updated Mongoose connection using async/await
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

startServer();

// REST APIs
app.get('/api/campaigns', async (req, res) => {
  const campaigns = await Campaign.find({});
  res.json(campaigns);
});

app.post('/api/campaigns', async (req, res) => {
  const campaign = new Campaign(req.body);
  await campaign.save();
  res.json({ success: true });
});
