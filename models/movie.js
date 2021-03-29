const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema, validateGenre } = require("./genre");
const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 4,
    maxlength: 255,
  },
  numberInStock: { type: Number, required: true, min: 0, max: 255 },
  dailyRentalRate: { type: Number, required: true, min: 0, max: 255 },
  genre: { type: genreSchema, required: true },
});

const Movie = new mongoose.model("Movie", movieSchema);

async function createMovie(movie) {
  const movieModel = new Movie({
    title: movie.title,
    numberInStock: movie.numberInStock,
    dailyRentalRate: movie.dailyRentalRate,
    genre: movie.genre,
  });
  await movieModel.save();
}

function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(255).required(),
    numberInStock: Joi.number().min(0).max(255).required(),
    dailyRentalRate: Joi.number().min(0).max(255).required(),
    genreId: Joi.string().required(),
  });
  const result = schema.validate(movie);
  return result;
}

exports.validateMovie = validateMovie;
exports.Movie = Movie;
exports.createMovie = createMovie;
