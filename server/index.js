import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import accounts from "./src/api/accounts/accounts.js";
import auth from "./src/api/authentications/authentications.js";
import contributions from "./src/api/contributions/contributions.js";
const app = express();

// Configurations
const dotenvPath = `./.env.${process.env.NODE_ENV}`;
dotenv.config({ path: dotenvPath });
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", process.env.CLIENT_URL);
  res.set("Access-Control-Allow-Credentials", true);
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.set("Access-Control-Allow-Methods", "GET, POST, DELETE");

  next();
});

// // Web UI
// app.use(express.static("../client/out"));

// APIs
app.use("/auth", auth);
app.use("/accounts", accounts);
app.use("/contributions", contributions);

app.listen(process.env.PORT, () => {
  console.log(
    `[${process.env.NODE_ENV}] Server is running on port ${process.env.PORT}.`
  );
});
