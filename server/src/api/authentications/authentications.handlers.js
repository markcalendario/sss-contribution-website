import connectDB from "../../db/connection.js";
import { saveMemberData, comparePasswords, signToken } from "./authentications.utils.js";

export async function handleIndividualMemberRegistration(req, res) {
  const db = await connectDB("sss_contribution");
  const payload = req.body;
  let lastInsertedID;

  await db.query("START TRANSACTION");

  // Save membership information into members table

  try {
    lastInsertedID = await saveMemberData(db, payload);
  } catch (error) {
    await db.query("ROLLBACK");
    await db.end();
    console.log(error);
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
  } catch (error) {
    await db.query("ROLLBACK");
    await db.end();

    console.error(error);

    return res.status(500).send({
      success: false,
      message: "There was an error saving your information as an individual member."
    });
  }

  await db.query("COMMIT");
  await db.end();

  return res.send({ success: true, message: "SSS account is successfully registered." });
}

export async function handleEmployerRegistration(req, res) {
  const db = await connectDB("sss_contribution");
  const payload = req.body;
  let lastInsertedID;

  await db.query("START TRANSACTION");

  // Save membership information into members table

  try {
    lastInsertedID = await saveMemberData(db, payload);
  } catch (error) {
    await db.query("ROLLBACK");
    await db.end();
    console.error(error);
    return res.status(500).send({ success: false, message: error });
  }

  // Save membership information into members table

  const sql = "INSERT INTO employers (sss_no, business_name, website) VALUES (?,?,?)";
  const values = [lastInsertedID, payload.businessName, payload.website];

  try {
    await db.query(sql, values);
  } catch (error) {
    await db.query("ROLLBACK");
    await db.end();

    console.error(error);

    return res.status(500).send({
      success: false,
      message: "There was an error saving your information as an employer."
    });
  }

  await db.query("COMMIT");
  await db.end();

  return res.send({ success: true, message: "SSS employer account is successfully registered." });
}

export async function handleLogin(req, res) {
  const connection = await connectDB("sss_contribution");

  const sql = "SELECT sss_no, password FROM members WHERE email = ? LIMIT 1";
  const values = [req.body.email];
  const [row, field] = await connection.query(sql, values);
  const fetchedData = row[0];
  // skip checking if there's a row (or email is present)
  // because it is already handled by the middleware

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
  res
    .cookie("auth_token", token, { maxAge: 86400000, httpOnly: true, secure: true })
    .send({ success: true, message: "You are now logged in." });
}
