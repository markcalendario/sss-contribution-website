import connectDB from "../../db/connection.js";
import { saveMemberData, comparePasswords, signToken } from "./authentications.utils.js";

export async function handleIndividualMemberRegistration(req, res) {
  const payload = req.body;

  let db;

  try {
    // Establish a connection
    db = await connectDB("sss_contribution");
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

  const values = [
    lastInsertedID,
    payload.crn,
    payload.firstName,
    payload.lastName,
    payload.middleName,
    payload.suffix
  ];

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

  let db;

  try {
    // Establish a connection
    db = await connectDB("sss_contribution");
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
  const values = [lastInsertedID, payload.businessName, payload.website];

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
  const connection = await connectDB("sss_contribution");

  const sql = "SELECT sss_no, password FROM members WHERE email = ? LIMIT 1";
  const values = [req.body.email];

  const [row, field] = await connection.query(sql, values);
  const fetchedData = row[0];

  // Skip checking if there's a row (or email is present)
  // Because it was already handled by the middleware

  const hashedPassword = fetchedData.password;

  let isPasswordCorrect;

  try {
    isPasswordCorrect = await comparePasswords(hashedPassword, req.body.password);
  } catch (error) {
    throw new Error("An error occured while logging in.", error);
  }

  if (!isPasswordCorrect) {
    return res.send({ success: false, message: "Incorrect credentials. Please try again." });
  }

  const token = await signToken(fetchedData.sss_no);
  connection.end();
  res
    .cookie("auth_token", token, { maxAge: 86400000, httpOnly: true, secure: true })
    .send({ success: true, message: "You are now logged in." });
}
