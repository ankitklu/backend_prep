const express = require("express");
const app = express();
const authRouter = express.Router();

app.use("/api/auth", authRouter);
const {
    loginHandler,
    logoutHandler,
    protectRouteMiddleware,
    signupHandler,
    profileHandler,
  } = require("../controllers/authController");

authRouter
  .post("/login", loginHandler)
  .post("/signup", signupHandler)
  .get("/logout", logoutHandler)
  .get("/profile", protectRouteMiddleware, profileHandler);

module.exports= authRouter;

