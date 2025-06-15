const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const locationRoutes = require('./routes/locationRoutes');
const { createProxyMiddleware } = require('http-proxy-middleware');
<<<<<<< Updated upstream
=======
const adminRoutes = require('./routes/authRoutes');
>>>>>>> Stashed changes

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

app.use('/api/auth', authRoutes);
app.use("/api/locations", locationRoutes);
<<<<<<< Updated upstream
=======
app.use('/api/admins', adminRoutes);
app.use("/api/admins", require("./routes/adminRoutes"));
>>>>>>> Stashed changes

module.exports = app;
