// services/weatherService.js
const axios = require('axios');

const API_KEY = process.env.WEATHER_API_KEY;

async function getWeatherByCity(city) {
  try {
    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    const data = res.data;
    const description = data.weather[0].description;
    const temp = data.main.temp;

    return `Weather in ${city}: ${description}, ${temp}°C`;
  } catch (error) {
    console.error(`Error fetching weather for ${city}:`, error.message);
    return 'Weather data unavailable';
  }
}

async function getWeatherByCoords(lat, lon) {
  try {
    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    const data = res.data;
    const description = data.weather[0].description;
    const temp = data.main.temp;

    return `Weather at your location: ${description}, ${temp}°C`;
  } catch (error) {
    console.error(`Error fetching weather for coordinates (${lat}, ${lon}):`, error.message);
    return 'Weather data unavailable';
  }
}

module.exports = {
  getWeatherByCity,
  getWeatherByCoords,
};
