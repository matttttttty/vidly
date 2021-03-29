const express = require("express");
const users = require("./route/users");
const auth = require("./route/auth");
const genres = require("./route/genres");
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

app.use(express.json());
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/genres", genres);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("listen on port " + port));
