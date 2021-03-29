const mongoose = require("mongoose");
const Joi = require("joi");

const Schema = mongoose.Schema;
const genreSchema = new Schema({
  name: { type: String, min: 3, match: /[a-z]/ },
});

const Genre = mongoose.model("Genres", genreSchema);

async function createGenre(genreName) {
  const genre = new Genre({
    name: genreName,
  });
  const result = await genre.save();
  console.log(result);
}

function validateGenre(data) {
  const schema = Joi.object({
    name: Joi.string().min(5).required(),
  });
  const result = schema.validate(data);
  return result;
}

exports.createGenre = createGenre;
exports.genreSchema = genreSchema;
exports.validateGenre = validateGenre;
exports.Genre = Genre;
