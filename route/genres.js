const express = require("express");
const { validateGenre, Genre } = require("../models/genre");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
router.get("/", async (req, res) => {
  const genres = await Genre.find();
  res.send(genres);
});

router.get("/:id", async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send("not found");
    res.send(genre);
  } catch (error) {
    console.log(error);
    return res.send("bad genreId");
  }
});

router.post("/", auth, async (req, res) => {
  const result = validateGenre(req.body);
  console.log(result);
  if (result.error) return res.status(400).send("bad data");
  const genre = new Genre({ name: req.body.name });
  await genre.save();
  res.send(genre);
});

// router.put("/:id", async (req, res) => {
//   // mongoose.set("useFindAndModify", false);
//   const genre = await Genre.findById(req.params.id);
//   if (!genre) return res.status(404).send("not found");
//   const validateResult = validateGenre(req.body);
//   if (validateResult.error) return res.status(400).send("bad data");
//   const result = await Genre.findOneAndUpdate(
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

router.delete("/", [auth, admin], async (req, res) => {
  const genre = await Genre.remove({});
  console.log(genre);
  res.send(genre);
});

module.exports = router;
