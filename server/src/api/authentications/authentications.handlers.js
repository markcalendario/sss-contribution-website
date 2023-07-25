import jwt from "jsonwebtoken";
import connectDB from "../../db/connection.js";
import { isString, isStringEmpty } from "../../global/utils/validators.js";
import { comparePasswords, saveMemberData, signToken } from "./authentications.utils.js";

export async function handleIndividualMemberRegistration(req, res) {
  const payload = req.body;
  const { crn, firstName, lastName, middleName, suffix } = payload;

  const db = await connectDB("sss_contribution");
  if (!db) {
    return res.status(500).send({ message: "Cannot connect to the database." });
  }

  try {
    // Start a transaction
    await db.query("START TRANSACTION");
  } catch (error) {
    db.end();
    console.error("[DB Error]", error);
    return res
      .status(500)
      .send({ success: false, message: "There was an error connecting with database." });
  }

  let lastInsertedID;

  try {
    // Save membership primary information into members table
    lastInsertedID = await saveMemberData(db, payload);
  } catch (error) {
    await db.query("ROLLBACK");
    db.end();
    console.error("[DB Error]", error);
    return res
      .status(500)
      .send({ success: false, message: "There was an error initializing your account." });
  }

  // Save information as an individual member into individual table

  const sql =
    "INSERT INTO individual (sss_no, crn, first_name, last_name, middle_name, suffix) VALUES (?,?,?,?,?,?)";
  const values = [lastInsertedID, crn, firstName, lastName, middleName, suffix];

  try {
    await db.query(sql, values);
    await db.query("COMMIT");
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("[DB Error]", error);
    return res.status(500).send({
      success: false,
      message: "There was an error saving your information as an individual member."
    });
  } finally {
    db.end();
  }

  return res.send({ success: true, message: "SSS account is successfully registered." });
}

export async function handleEmployerRegistration(req, res) {
  const payload = req.body;
  const { website, businessName } = payload;

  const db = await connectDB("sss_contribution");
  if (!db) {
    return res.status(500).send({ message: "Cannot connect to the database." });
  }

  try {
    // Start a transaction
    await db.query("START TRANSACTION");
  } catch (error) {
    db.end();
    console.error("[DB Error]", error);
    return res
      .status(500)
      .send({ success: false, message: "There was error connecting with database." });
  }

  // Save membership information into members table

  let lastInsertedID;

  try {
    lastInsertedID = await saveMemberData(db, payload);
  } catch (error) {
    await db.query("ROLLBACK");
    db.end();
    console.error("[DB Error]", error);
    return res
      .status(500)
      .send({ success: false, message: "There was an error initializing your account." });
  }

  // Save membership information into members table

  const sql = "INSERT INTO employers (sss_no, business_name, website) VALUES (?,?,?)";
  const values = [lastInsertedID, businessName, website];

  try {
    await db.query(sql, values);
    await db.query("COMMIT");
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("[DB Error]", error);
    return res.status(500).send({
      success: false,
      message: "There was an error saving your information as an employer."
    });
  } finally {
    db.end();
  }

  return res.send({ success: true, message: "SSS employer account is successfully registered." });
}

export async function handleLogin(req, res) {
  const db = await connectDB("sss_contribution");
  if (!db) {
    return res.status(500).send({ message: "Cannot connect to the database." });
  }

  const sql = "SELECT sss_no, password FROM members WHERE email = ? LIMIT 1";
  const values = [req.body.email];

  let rows;

  try {
    [rows] = await db.query(sql, values);
  } catch (error) {
    return res.send({ success: false, message: "An error occured while logging in." });
  } finally {
    db.end();
  }

  const fetchedData = rows[0];

  // Skip checking if there's a row (or email is present)
  // Because it was already handled by the middleware, so it will return a row

  const hashedPassword = fetchedData.password;

  let isPasswordCorrect;

  try {
    isPasswordCorrect = await comparePasswords(hashedPassword, req.body.password);
  } catch (error) {
    console.error("[DB Error]", error);
    return res.send({ success: false, message: "An error occured while logging in." });
  }

  if (!isPasswordCorrect) {
    return res.send({ success: false, message: "Incorrect credentials. Please try again." });
  }

  const token = await signToken(fetchedData.sss_no);

  res
    .cookie("auth_token", token, { maxAge: 86400000, httpOnly: true, secure: true })
    .send({ success: true, message: "You are now logged in." });
}

export async function handleLogout(req, res) {
  res.clearCookie("auth_token").send({ success: true, message: "You are now logged out." });
}

export function handleIsAuth(req, res) {
  const authCookie = req.cookies.auth_token;

  if (!isString(authCookie)) {
    return res.clearCookie("auth_token").send({
      success: false,
      message: "Authorization token is not a string.",
      isAuth: false
    });
  }

  if (isStringEmpty(authCookie)) {
    return res
      .clearCookie("auth_token")
      .send({ success: false, message: "Authorization token is missing.", isAuth: false });
  }

  try {
    jwt.verify(authCookie, process.env.TOKEN_SALT);
  } catch (error) {
    return res
      .clearCookie("auth_token")
      .send({ success: false, message: "Authorization token is invalid.", isAuth: false });
  }

  return res.send({ success: true, message: "You are authorized.", isAuth: true });
}
