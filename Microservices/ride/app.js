const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const connect = require('./db/db');
connect();
const cookieParser = require('cookie-parser');
const rideRoutes = require('./routes/ride.routes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/', rideRoutes);


module.exports = app;