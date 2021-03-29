const jwt = require("jsonwebtoken");
const config = require("config");

function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.send("access denied, no token provided.");
  try {
    console.log(config.get("jwtprivatekey"));
    const decode = jwt.verify(token, config.get("jwtprivatekey"));
    req.user = decode;
    next();
  } catch (error) {
    res.status(400).send("invalid token." + error);
  }
}

module.exports = auth;
