const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true,"title is required"]
  },
  description: {
    type: String,
    required: [true,"description is required"]
  },
  releaseYear: {
    type: Number,
    required: [true,"Date of Release is required"]
  },
  genre: {
    type: String,
    required: [true,"Genre is required"],
    enum: ['Drama', 'Comedy', 'Action', 'Thriller', 'Horror', 'Romance', 'Sci-Fi'] // Example genres
  },
  rating: {
    type: Number,
    min: [1,"Ratign can't be less than 1"],
    max: [5,"Rating can't be more than 5"]
  },
  cast: [String],
  director: String,
  thumbnail: String, // URL for movie's thumbnail
  trailerLink: String, // URL for movie's trailer
  isPremium: {
    type: Boolean,
    required: true,
    default: false // Free if not premium
  }
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
