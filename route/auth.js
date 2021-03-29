const express = require("express");
const _ = require("lodash");
const { validateUser, User } = require("../models/user");
const router = express.Router();
const bcrypt = require("bcrypt");
const config = require("config");

router.post("", async (req, res) => {
  const result = validateUser(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("invalid email or password");
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("invalid email or password");
  console.log(config.get("jwtprivatekey"));
  const token = user.generateAuthToken();
  res.send(token);
});

module.exports = router;
