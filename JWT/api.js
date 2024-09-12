const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());

const jwt = require("jsonwebtoken");
const util = require("util");
const promisify = util.promisify;
const promisfiedJWTsign = promisify(jwt.sign);
const promisfiedJWTverify = promisify(jwt.verify);

const SECRET_KEY = "abracadabra";

app.get("/sign", async function (req, res) {
  // create token
  const authToken = await promisfiedJWTsign({ payload: "asdfjhnsalkjdfnaf" }, SECRET_KEY);

  // token -> cookie
  res.cookie("jwt", authToken, {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true,
  });

  // res send
  res.status(200).json({
    message: "Signin through JWT",
  });
});

app.get("/verify", async function (req, res) {
  if (req.cookies && req.cookies.jwt) {
    const authToken = req.cookies.jwt;
    try {
      const unlockedToken = await promisfiedJWTverify(authToken, SECRET_KEY);
      res.status(200).json({
        message: "Verified through JWT",
        unlockedToken: unlockedToken,
      });
    } catch (err) {
      res.status(401).json({
        message: "Invalid or expired JWT token",
      });
    }
  } else {
    res.status(400).json({
      message: "No JWT token found",
    });
  }
});

app.listen(3000, function () {
  console.log("The server is running at port 3000");
});
