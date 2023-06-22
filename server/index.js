import express from "express";
const app = express();
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import auth from "./src/api/authentications/authentications.js";
import accounts from "./src/api/accounts/accounts.js";

// Configurations
const dotenvPath = `./.env.${process.env.NODE_ENV}`;
dotenv.config({ path: dotenvPath });
app.use(express.json());
app.use(cookieParser());

// APIs
app.use("/auth", auth);
app.use("/accounts", accounts);

app.listen(process.env.PORT, () => {
  console.log(`[${process.env.NODE_ENV}] Server is running on port ${process.env.PORT}.`);
});
