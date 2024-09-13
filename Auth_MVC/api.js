const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
app.use(express.json()); //middlewares
const UserModel = require("./userModel");
const {
  createUser,
  getAllUser,
  getUserById,
  deleteUser,
} = require("./userController");

dotenv.config();

const dbUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ibcnx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose
  .connect(dbUrl)
  .then(function (connection) {
    console.log("connected to db");
  })
  .catch((err) => console.log(err));

app.post("/user", createUser);
app.get("/user", getAllUser);
app.get("/user/:id", getUserById);
app.delete("/user/:id", deleteUser);

async function loginHandler() {
    try {
        const userObject = req.body;
        
        
      } 
      catch (err) {
        console.log("Error is: ", err);
        res.status(400).json({
            message: "Required fields missing",
            status: "failure",
            error: err,
          });
      }
}

async function signupHandler(req, res) {
  try {
    const userObject = req.body;

    if (!userObject.email || !userObject.password) {
      return res.status(400).json({
        message: "Required fields missing",
        status: "failure",
        error: err,
      });
    }
    const user = await UserModel.findOne({ email: userObject.email });

    if (user) {
      return res.status(400).json({
        message: "user is already logged in",
        status: "failure",
      });
    }

    const newUser = await UserModel.create(userObject);
    res.status(201).json({
      message: "user ccreated successfully",
      user: newUser,
      status: "Success",
    });

  } 
  catch (err) {
    console.log("Error is: ", err);
    res.status(400).json({
        message: "Required fields missing",
        status: "failure",
        error: err,
      });
  }
}

app.post("/login", loginHandler);
app.post("/signup", signupHandler);

app.listen(3000, function (req, res) {
  console.log("Server started at port no 3000");
});
