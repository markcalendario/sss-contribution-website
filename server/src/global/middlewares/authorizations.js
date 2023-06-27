import jwt from "jsonwebtoken";
import { isArrayEmpty, isString, isStringEmpty } from "../utils/validators.js";
import { decodeAuthToken } from "../utils/jwt.js";
import connectDB from "../../db/connection.js";

export function validateAuthCookie(req, res, next) {
  const authToken = req.cookies.auth_token;

  if (!isString(authToken)) {
    return res.status(401).send({ success: false, message: "Auth token must be string." });
  }

  if (isStringEmpty(authToken)) {
    return res.status(401).send({ success: false, message: "Auth token is missing." });
  }

  try {
    jwt.verify(authToken, process.env.TOKEN_SALT);
  } catch (error) {
    return res
      .clearCookie("auth_token")
      .status(401)
      .send({ success: false, message: "Invalid cookie, " + error.message });
  }

  next();
}

export async function isIndividualMember(req, res, next) {
  const sss_no = decodeAuthToken(req.cookies.auth_token).sss_no;

  const sql = "SELECT 1 FROM individual WHERE sss_no = ?";
  const values = [sss_no];

  const db = await connectDB("sss_contribution");
  if (!db) {
    return res.status(500).send({ message: "Cannot connect to the database." });
  }

  let rows;

  try {
    [rows] = await db.query(sql, values);
  } catch (error) {
    console.error("[DB Error]", error);
    return res
      .status(500)
      .send({ success: false, message: "An error occured while fetching your information" });
  } finally {
    db.end();
  }

  if (isArrayEmpty(rows)) {
    return res.status(401).send({ success: false, message: "You are not an individual member." });
  }

  next();
}

export async function isEmployerMember(req, res, next) {
  const sss_no = decodeAuthToken(req.cookies.auth_token).sss_no;

  const sql = "SELECT sss_no FROM employers WHERE sss_no = ?";
  const values = [sss_no];

  const db = await connectDB("sss_contribution");
  if (!db) {
    return res.status(500).send({ message: "Cannot connect to the database." });
  }

  let rows;

  try {
    [rows] = await db.query(sql, values);
  } catch (error) {
    console.error("[DB Error]", error);
    return res
      .status(500)
      .send({ success: false, message: "An error occured while fetching your information" });
  } finally {
    db.end();
  }

  if (isArrayEmpty(rows)) {
    return res.status(401).send({ success: false, message: "You are not an employer member." });
  }

  next();
}
