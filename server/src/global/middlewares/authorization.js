import jwt from "jsonwebtoken";
import { isEmpty } from "../utils/validators.js";

export function validateAuthCookie(req, res, next) {
  const authCookie = req.cookies.auth_token;

  if (isEmpty(authCookie)) {
    return res.status(401).send({ success: false, message: "Cookie is absent." });
  }

  try {
    jwt.verify(authCookie, process.env.TOKEN_SALT);
  } catch (error) {
    return res.status(401).send({ success: false, message: "Invalid cookie, " + error.message });
  }

  next();
}
