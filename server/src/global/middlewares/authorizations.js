import jwt from "jsonwebtoken";
import { isEmpty } from "../utils/validators.js";
import { decodeAuthToken } from "../utils/jwt.js";
import connectDB from "../../db/connection.js";

export function validateAuthCookie(req, res, next) {
  const authCookie = req.cookies.auth_token;

  if (isEmpty(authCookie)) {
    return res.status(401).send({ success: false, message: "Cookie is absent." });
  }

  let payload;

  try {
    payload = jwt.verify(authCookie, process.env.TOKEN_SALT);
  } catch (error) {
    return res
      .clearCookie("auth_token")
      .status(401)
      .send({ success: false, message: "Invalid cookie, " + error.message });
  }

  // Check if sss_no is present

  if (isEmpty(payload.sss_no)) {
    return res
      .clearCookie("auth_token")
      .status(401)
      .send({ success: false, message: "Invalid cookie, no identity." });
  }

  next();
}

export async function isIndividualMember(req, res, next) {
  const sss_no = decodeAuthToken(req.cookies.auth_token).sss_no;

  const sql = "SELECT 1 FROM individual WHERE sss_no = ?";
  const values = [sss_no];

  const connection = await connectDB("sss_contribution");
  if (!connection) {
    return res.send({ message: "Cannot connect to the database." });
  }

  let rows;

  try {
    [rows] = await connection.query(sql, values);
  } catch (error) {
    console.error("[DB Error]", error);
    return res
      .status(500)
      .send({ success: false, message: "An error occured while fetching your information" });
  } finally {
    connection.end();
  }

  if (isEmpty(rows)) {
    return res.status(401).send({ success: false, message: "You are not an individual member." });
  }

  next();
}

export async function isEmployerMember(req, res, next) {
  const sss_no = decodeAuthToken(req.cookies.auth_token).sss_no;

  const sql = "SELECT 1 FROM employers WHERE sss_no = ?";
  const values = [sss_no];

  const connection = await connectDB("sss_contribution");
  if (!connection) {
    return res.send({ message: "Cannot connect to the database." });
  }

  let rows;

  try {
    [rows] = await connection.query(sql, values);
  } catch (error) {
    console.error("[DB Error]", error);
    return res
      .status(500)
      .send({ success: false, message: "An error occured while fetching your information" });
  } finally {
    connection.end();
  }

  if (isEmpty(rows)) {
    return res.status(401).send({ success: false, message: "You are not an employer member." });
  }

  next();
}
