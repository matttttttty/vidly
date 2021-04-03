const express = require("express");
const { validateMovie, Movie } = require("../models/movie");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Genre } = require("../models/genre");

router.get("/", async (req, res) => {
  const movies = await Movie.find();
  res.send(movies);
});

router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send("not found");
    res.send(movie);
  } catch (error) {
    console.log(error);
    return res.send("bad movieId");
  }
});

router.post("/", async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send("bad data" + error);
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  const movie = new Movie({
    title: req.body.title,
    genre: genre,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  await movie.save();
  res.send(movie);
});

router.put("/:id", async (req, res) => {
  const validateResult = validateMovie(req.body);

  if (validateResult.error) {
    console.log(validateResult.error);
    return res.status(400).send("bad data" + validateResult.error);
  }

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  const movie = await Movie.findOneAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: genre,
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    { new: true }
  );
  if (!movie) res.status(404).send("the movie with given id was not found..");
  res.send(movie);
});

router.delete("/:id", async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);
  if (!movie) res.status(404).send("the movie with given id was not founded.");
  console.log(movie);
  res.send(movie);
});

module.exports = router;
