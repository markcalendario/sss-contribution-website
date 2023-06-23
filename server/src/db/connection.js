import mysql from "mysql2/promise";

export default async function connectDB(database, res) {
  let connection = null;

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWfORD,
      database: database
    });
  } catch (error) {
    console.error("[DB CON ERR] There was an error connecting in the database.");
  }

  return connection;
}
