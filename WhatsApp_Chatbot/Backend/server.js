const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const chatbotController = require('./controllers/chatbotController');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.post('/whatsapp', chatbotController);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
