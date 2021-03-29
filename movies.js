const express = require("express");
const { validateMovie, Movie } = require("./models/movie");
const moviesApp = express();
const { Genre } = require("./models/genre");

moviesApp.use(express.json());

moviesApp.get("/api/movies", async (req, res) => {
  const movies = await Movie.find().sort("title");
  res.send(movies);
});

moviesApp.get("/api/movies/:id", async (req, res) => {
  const movie = await Movie.findById({ _id: req.params.id });
  console.log(movie);
  if (!movie) return res.status(404).send("not found");
  res.send(movie);
});

moviesApp.post("/api/movies", async (req, res) => {
  const result = validateMovie(req.body);
  console.log(result);
  if (result.error) return res.status(400).send("bad data");
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("invalid genre");
  let movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    dailyRentalRate: req.body.dailyRentalRate,
    numberInStock: req.body.numberInStock,
  });
  movie = await movie.save();
  res.send(movie);
});

// moviesApp.put("/api/movies/:id", async (req, res) => {
//   // mongoose.set("useFindAndModify", false);
//   const movie = await Movie.findById(req.params.id);
//   if (!movie) return res.status(404).send("not found");
//   const validateResult = validateMovie(req.body);
//   if (validateResult.error) return res.status(400).send("bad data");
//   const result = await Movie.findOneAndUpdate(
//     req.params.id,
//     { $set: { name: req.body.name } },
//     { new: true },
//     (err, result) => {
//       if (err) return res.status(500).send(err);
//       return res.send(result);
//     }
//   );
//   console.log(result);
// });

// moviesApp.delete("/api/movies/:id", async (req, res) => {
//   const movie = await Movie.findOneAndDelete({ _id: req.params.id });
//   if (!movie) return res.status(404).send("not found");
//   console.log(movie);
//   res.send(movie);
// });

moviesApp.listen(5000);
