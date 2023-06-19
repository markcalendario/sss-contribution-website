const mysql = require("mysql2/promise");

async function connectDB(database) {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: database
  });

  return connection;
}

module.exports = connectDB;
