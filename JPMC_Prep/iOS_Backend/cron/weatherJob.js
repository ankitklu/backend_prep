// cron/weatherJob.js
const cron = require('node-cron');
const User = require('../models/User');
const { getWeatherByCity, getWeatherByCoords } = require('../services/weatherService');
const { sendSMS } = require('../services/smsService');

cron.schedule('0 7 * * *', async () => {
  console.log('📨 Starting daily weather SMS job...');

  try {
    const users = await User.find({ subscribed: true });

    for (const user of users) {
      let weatherInfo;

      if (user.lat && user.lng) {
        weatherInfo = await getWeatherByCoords(user.lat, user.lng);
      } else if (user.location) {
        weatherInfo = await getWeatherByCity(user.location);
      } else {
        weatherInfo = 'No location available to fetch weather.';
      }

      const msg = `Good morning ${user.name}! ${weatherInfo}`;
      await sendSMS(user.phone, msg);
    }

    console.log('✅ Weather SMS job completed.');
  } catch (error) {
    console.error('❌ Error in weather SMS job:', error.message);
  }
});
