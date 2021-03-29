const express = require("express");
const _ = require("lodash");
const { validateUser, User } = require("../models/user");
const router = express.Router();
const bcrypt = require("bcrypt");

// router.use(function timeLog(req, res, next) {
//   console.log("Time: ", Date.now());
//   next();
// });

router.get("/", async (req, res) => {
  const users = await User.find();
  res.send(users);
});

router.get("/:id", async (req, res) => {
  const user = await User.findById({ _id: req.params.id });
  console.log(user);
  if (!user) return res.status(404).send("not found");
  res.send(user);
});

router.post("", async (req, res) => {
  const result = validateUser(req.body);

  if (result.error)
    return res.status(400).send(result.error.details[0].message);
  let user = await User.findOne({ email: req.body.email });
  if (user)
    return res.status(400).send("user already exsit.Please change a email Id.");

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  user = new User(_.pick(req.body, ["name", "email", "isAdmin"]));
  user.password = hashedPassword;
  await user.save();
  const token = user.generateAuthToken();
  res.header("x-auth-token", token).send(_.pick(user, ["name", "email"]));
});

// router.put("/api/genres/:id", async (req, res) => {
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

router.delete("/:id", async (req, res) => {
  const user = await User.findOneAndDelete({ _id: req.params.id });
  if (!user) return res.status(404).send("not found");
  console.log(user);
  res.send(user);
});

module.exports = router;
