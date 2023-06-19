const bcrypt = require("bcrypt");
const connectDB = require("../../db/connection");

function hashPassword(plainPassword) {
  return bcrypt.hashSync(plainPassword, 10);
}

/**
 * Check if email is registered.
 */
async function isEmailRegistered(email) {
  const connection = await connectDB("sss_contribution");
  const sql = "SELECT COUNT(*) as isRegistered FROM members WHERE email = ?";
  const [result, fields] = await connection.query(sql, email);
  connection.end();

  if (result[0].isRegistered <= 0) {
    return false;
  }

  return true;
}

module.exports = { hashPassword, isEmailRegistered };
