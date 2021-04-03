const express = require("express");
const users = require("./route/users");
const auth = require("./route/auth");
const genres = require("./route/genres");
const movies = require("./route/movies");
const mongoose = require("mongoose");
const app = express();
const config = require("config");

if (!config.get("jwtprivatekey")) {
  console.error("fatal error: jwtprivatekey is not defind.");
  process.exit(1);
}

const url = "mongodb://localhost/vidly";
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("connected to mongodb.");
  })
  .catch((err) => console.error("connect to mongodb." + err));

app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild"
  );
  res.header("X-Powered-By", " 3.2.1");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.use(express.json());
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/genres", genres);
app.use("/api/movies", movies);

// const port = process.env.PORT || 3000;
const port = 5100;
app.listen(port, () => console.log("listen on port " + port));
