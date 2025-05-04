const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const UserModel = require("./userModel");
const getCurrentMovies = require("./controller/movieController");
 
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const emailSender = require("./dynamicEmailSender");

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

async function loginHandler(req, res) {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "Invalid email or password",
        status: "failure",
      });
    }
    const areEqual = password == user.password;
    if (!areEqual) {
      return res.status(400).json({
        message: "Invalid email or password",
        status: "failure",
      });
    }

    //generate token
    const authToken = await promisfiedJWTsign(
      { id: user["_id"] },
      process.env.JWT_SECRET
    );

    // token -> cookie
    res.cookie("jwt", authToken, {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true,
    });

    // res send
    res.status(200).json({
      message: "Login Successful",
      status: "Success",
      username: user,
    });
  } catch (err) {
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
  } catch (err) {
    console.log("Error is: ", err);
    res.status(400).json({
      message: "Required fields missing",
      status: "failure",
      error: err,
    });
  }
}

const otpGenerator = function () {
  return Math.floor(Math.random() * 10000 + 90000);
};

async function protectRouteMiddleware(req, res, next) {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({
        message: "unauthorized access",
        status: "failure",
      });
    }

    const decryptedToken = await promisfiedJWTverify(
      token,
      process.env.JWT_SECRET
    );
    req.id = decryptedToken.id;
    console.log(decryptedToken);
    next();
  } catch (err) {
    res.status(500).json({
      message: "internal server error",
      status: "failure",
    });
  }
}

async function forgetPasswordHandler(req, res) {
  try {
    //1
    if (req.body.email == undefined) {
      return res.status(401).json({
        status: "failure",
        message: "Please enter the email for forget Password",
      });
    }
    const user = await UserModel.findOne({ email: req.body.email });

    //2
    if (user == null) {
      return res.status(404).json({
        status: "failure",
        message: "user not found for this email",
      });
    }

    //3
    const otp = otpGenerator();
    user.otp = otp;
    user.otpExpiry = Date.now() + 1000 * 60 * 10;

    //4 save to db
    await user.save({ validateBeforeSave: false });

    //email send
    const templateData = { name: user.name, otp: user.otp };
    await emailSender("./Templates/otp.html", user.email, templateData);

    res.status(200).json({
      message: "otp is sent successfully",
      status: "success",
      otp: otp,
      resetURL: `http://localhost:3000/api/auth/resetPassword/${user["_id"]}`,
    });
  } catch (err) {
    console.log("Error is", err);
    res.status(500).json({
      message: err.message,
      status: "Failure",
    });
  }
}

async function resetPasswordHandler(req, res) {
  try {
    /*****
     * 1. id, id
     * 2. if otp , password , confirmPassword are present
     *        * otp shouldn't be expired
     *        * otp compare -> if matches
     *        * password update
     *        *re-route them to login page
     *
     */
    let resetDetails = req.body;
    if (
      !resetDetails.password ||
      !resetDetails.confirmPassword ||
      !resetDetails.otp ||
      resetDetails.password != resetDetails.confirmPassword
    ) {
      res.status(401).json({
        status: "failure",
        message: "invalid request",
      });
    }

    const userId = req.params.userId;
    const user = await UserModel.findById(userId);
    if (user == null) {
      return res.status(404).json({
        status: "failure",
        message: "user not found",
      });
    }
    if (user.otp == undefined) {
      return res.status(401).json({
        status: "failure",
        message: "unauthorized access to reset Password",
      });
    }

    if (Date.now() > user.otpExpiry) {
      return res.status(401).json({
        status: "failure",
        message: "otp expired",
      });
    }

    if (user.otp != resetDetails.otp) {
      return res.status(401).json({
        status: "failure",
        message: "otp is incorrect",
      });
    }

    user.password = resetDetails.password;
    user.confirmPassword = resetDetails.confirmPassword;

    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();
    res.status(200).json({
      staus: "success",
      message: "password reset successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
      status: "failure",
    });
  }
}






app.get("/api/movies/currentPlaying", getCurrentMovies);





app.post("/api/auth/login", loginHandler);
app.post("/api/auth/signup", signupHandler);
app.patch("/api/auth/forgetPassword", forgetPasswordHandler);
app.patch("/api/auth/resetpassword/:id", resetPasswordHandler);

app.listen(3001, function () {
  console.log("Server started at 3001");
});

