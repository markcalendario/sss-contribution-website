const express = require("express");
const app = express();
const dotenv = require("dotenv");
const auth = require("./api/auth/auth");
const accounts = require("./api/accounts/accounts");

// Configurations
const dotenvPath = `./.env.${process.env.NODE_ENV}`;
dotenv.config({ path: dotenvPath });
app.use(express.json());

// APIs
app.use("/auth", auth);
app.use("/accounts", accounts);

app.listen(process.env.PORT, () => {
  console.log(`[${process.env.NODE_ENV}] Server is running on port ${process.env.PORT}.`);
});
