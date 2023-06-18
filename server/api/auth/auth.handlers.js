const connectDB = require("../../db/connection");

function handleAuth(req, res) {
  const connection = connectDB("sss_contribution");

  connection.query("SELECT * FROM members", (error, result) => {
    if (error) {
    }

    console.log(result);
  });
}

module.exports = { handleAuth };
