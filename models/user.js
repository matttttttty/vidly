const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const { join } = require("lodash");

const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: { type: String, min: 5, match: /[a-z]/ },
  email: { type: String, unique: true },
  password: { type: String, min: 5, max: 255 },
  isAdmin: { type: Boolean },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, email: this.email, isAdmin: this.isAdmin },
    config.get("jwtprivatekey")
  );
  return token;
};

const User = mongoose.model("user", userSchema);

function validateUser(data) {
  const schema = Joi.object({
    name: Joi.string().min(5).required(),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required(),
    password: Joi.string().min(5).max(255).required(),
    isAdmin: Joi.bool(),
  });
  const result = schema.validate(data);
  return result;
}

exports.validateUser = validateUser;
exports.User = User;
