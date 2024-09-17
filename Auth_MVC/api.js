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

const jwt = require("jsonwebtoken");
const util = require("util");
const promisify = util.promisify;
const promisfiedJWTsign = promisify(jwt.sign);
const promisfiedJWTverify = promisify(jwt.verify);
const cookieParser= require("cookie-parser");

app.use(cookieParser());
dotenv.config();

const dbUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ibcnx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose
  .connect(dbUrl)
  .then(function (connection) {
    console.log("connected to db");
  })
  .catch((err) => console.log(err));



async function loginHandler(req, res) {
    try {
        const {email, password} = req.body;
        const user= await UserModel.findOne({email});

        if(!user){
          return res.status(404).json({
            message: "Invalid email or password",
            status: "failure",
          });
        }
        const areEqual = password == user.password;
        if(!areEqual){
          return res.status(400).json({
            message: "Invalid email or password",
            status: "failure"
          })
        }

        //generate token
        const authToken = await promisfiedJWTsign({ id:user["_id"] }, process.env.JWT_SECRET);

        // token -> cookie
        res.cookie("jwt", authToken, {
          maxAge: 1000 * 60 * 60 * 24, // 1 day
          httpOnly: true,
        });

        // res send
        res.status(200).json({
          message: "Login Successful",
          status: "Success",
          username: user
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


async function protectRouteMiddleware(req,res, next){
  try{
    const token= req.cookies.jwt;
    if(!token){
      return res.status(401).json({
        message: "unauthorized access",
        status: "failure"
      })
    }

    const decryptedToken= await promisfiedJWTverify(token, process.env.JWT_SECRET);
    req.id= decryptedToken.id;
    console.log(decryptedToken);
    next();

  }

  catch(err){
    res.status(500).json({
      message: "internal server error",
      status: "failure"
    })
  }
}

async function profileHandler(req,res){
  try{
    
    const userId= req.id;
    const user= await UserModel.findById(userId);
    if(!user){
      return res.status(404).json({
        message: "user not found",
        status: "failure"
      })
    }

    res.json({
      message: "Profile worked",
      status: "Success",
      user: user
    });

  }
  catch(err){
    res.status(500).json({
      message: "Invalid creds",
      status: "Failure"
    })
  }
}

async function logoutHandler(req, res){
  try{
    res.clearCookie('jwt',{path:"/"});
    res.json({
      message: "logout successfully",
      status: "success"
    })
  }
  catch(err){
    res.status(500).json({
      message: "Internal server error",
      status: "Failure"
    })
  }
}

async function isAdminMiddleware(req, res, next){
  const id= req.id;
  const adminUser= await UserModel.findById(id);
  if(adminUser.role!== "admin"){
    return res.status(403).json({
      message : "You are not the admin",
      status: "Failure"
    })
  }
  else{
    next();
    //next
    //next2
  }
}

app.post("/login", loginHandler);
app.post("/signup", signupHandler);
app.get("/logout", logoutHandler);
app.get("/profile",protectRouteMiddleware, profileHandler);


//user handler functions
app.post("/user", createUser);
app.get("/user", protectRouteMiddleware,isAdminMiddleware,getAllUser);
app.get("/user/:id", getUserById);
app.delete("/user/:id", protectRouteMiddleware, deleteUser);

app.listen(3000, function (req, res) {
  console.log("Server started at port no 3000");
});
