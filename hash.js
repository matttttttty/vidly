const bcrypt = require("bcrypt");
const { range } = require("lodash");

async function run() {
  const salt = await bcrypt.genSalt();
  const hashed = await bcrypt.hash("1234", salt);
  console.log(hashed);
  console.log(salt);
}

run();
