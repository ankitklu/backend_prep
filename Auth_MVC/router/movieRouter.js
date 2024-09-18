const express = require("express");
const app = express();
const movieRouter = express.Router();
app.use("/api/movie", movieRouter);

const {
    createMovie,
    getAllMovie,
    getMovie,
    deleteMovie,
  } = require("../controllers/movieController");

  const {
    protectRouteMiddleware,
    isAdminMiddleware
  }= require("../controllers/authController");

movieRouter
  .post("/", createMovie)
  .get("/", protectRouteMiddleware, isAdminMiddleware, getAllMovie)
  .get("/:id", getMovie)
  .delete("/:id", protectRouteMiddleware, deleteMovie);

  module.exports= movieRouter;