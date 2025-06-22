const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const locationRoutes = require('./routes/locationRoutes');
const { createProxyMiddleware } = require('http-proxy-middleware');
const adminRoutes = require('./routes/authRoutes');
const meetingRoutes = require("./routes/meetings")
const messageRoutes = require("./routes/messages")
const axios = require('axios');
require('dotenv').config();
const campaignRoutes = require('./routes/campaignRoutes');


const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use(
  '/media',
  createProxyMiddleware({
    target: 'http://localhost:8501',
    changeOrigin: true,
    pathRewrite: {
      '^/media': '', // So /media in React becomes root in Streamlit
    },
  })
);

const pageMap = {
  dashboard: "/dashboard",
  media: "/media",
  location: "/location-form",
  post: "/post-generator",
  communication: "/communications",
  admin: "/admin",
  meetings: "/meetings",
  campaigns: "/campaigns"
};

app.post("/chat", async (req, res) => {
  const message = req.body.message;

  try {
    const groqResponse = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `You are a dashboard assistant. The user may ask to navigate to pages like dashboard, media, meetings, admin, etc.
Return only a JSON with a 'reply' and optional 'redirect' field If the user thanks you for the service, just reply with a positive message.
Use this map: ${Object.entries(pageMap)
              .map(([k, v]) => `${k}: ${v}`)
              .join(", ")}.`,
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.2,
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const text = groqResponse.data.choices[0].message.content;
    const parsed = JSON.parse(text);

    res.json(parsed);
  } catch (err) {
    console.error("GROQ Error:", err.response?.data || err.message);
    res.status(500).json({ reply: "AI processing failed.", redirect: null });
  }
});

app.use('/api/auth', authRoutes);
app.use("/api/locations", locationRoutes);
app.use('/api/admins', adminRoutes);
app.use("/api/admins", require("./routes/adminRoutes"));
app.use("/api/meetings", meetingRoutes)
app.use("/api/messages", messageRoutes)
app.use('/api/campaigns', campaignRoutes);

app.use("/api/videos", require("./routes/LMS/videos"))
app.use("/api/topics", require("./routes/LMS/topics"))
app.use("/api/quizzes", require("./routes/LMS/quizzes"))
app.use("/api/users", require("./routes/LMS/users"))
app.use("/api/progress", require("./routes/LMS/progress"))

module.exports = app;
