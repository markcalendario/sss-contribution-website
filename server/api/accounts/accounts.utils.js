const bcrypt = require("bcrypt");

function hashPassword(plainPassword) {
  return bcrypt.hashSync(plainPassword, 10);
}

module.exports = { hashPassword };
