import jwt from "jsonwebtoken";
import { isEmpty } from "../utils/validators.js";
import { decodeAuthToken } from "../utils/jwt.js";
import connectDB from "../../db/connection.js";

export function validateAuthCookie(req, res, next) {
  const authCookie = req.cookies.auth_token;

  if (isEmpty(authCookie)) {
    return res.status(401).send({ success: false, message: "Cookie is absent." });
  }

  try {
    jwt.verify(authCookie, process.env.TOKEN_SALT);
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
  const connection = await connectDB("sss_contribution");

  const sql = "SELECT 1 FROM individual WHERE sss_no = ?";
  const values = [sss_no];

  const [rows, field] = await connection.query(sql, values);
  await connection.end();

  if (isEmpty(rows)) {
    return res.status(401).send({ success: false, message: "You are not an individual member." });
  }

  next();
}

export async function isEmployerMember(req, res, next) {
  const sss_no = decodeAuthToken(req.cookies.auth_token).sss_no;
  const connection = await connectDB("sss_contribution");

  const sql = "SELECT 1 FROM employers WHERE sss_no = ?";
  const values = [sss_no];

  const [rows, field] = await connection.query(sql, values);
  await connection.end();

  if (isEmpty(rows)) {
    return res.status(401).send({ success: false, message: "You are not an employer member." });
  }

  next();
}
