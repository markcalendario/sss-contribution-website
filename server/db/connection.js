const mysql = require("mysql2");

function connectDB(database) {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: database
  });

  return connection;
}

module.exports = connectDB;
