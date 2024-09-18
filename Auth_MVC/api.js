const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const UserModel = require("./models/userModel");

const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

app.use(express.json()); //middlewares
app.use(cookieParser());
dotenv.config();

const dbUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ibcnx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose
  .connect(dbUrl)
  .then(function (connection) {
    console.log("connected to db");
  })
  .catch((err) => console.log(err));




const authRouter = require("./router/authRouter.js");
const userRouter= require("./router/userRouter.js");
const movieRouter = require("./router/movieRouter.js");
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/movie", movieRouter);


/***********************User routes and handlers**************************************/




/**********************Movie routes and handlers***************************************/


app.listen(3000, function (req, res) {
  console.log("Server started at port no 3000");
});
