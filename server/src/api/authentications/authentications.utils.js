import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectDB from "../../db/connection.js";

export async function hashPassword(plainPassword) {
  try {
    return await bcrypt.hash(plainPassword, 3);
  } catch (error) {
    console.error("[Password Hashing Error]: ", error);
    throw new Error("Error occured in hashing a password.");
  }
}

export async function saveMemberData(db, validatedPayload) {
  const sql =
    "INSERT INTO members (address, zip, tin, mobile, telephone, email, payor_type, password) VALUES (?,?,?,?,?,?,?,?)";

  let hashedPassword;

  try {
    hashedPassword = await hashPassword(validatedPayload.password);
  } catch (error) {
    throw new Error("There was an error saving your membership information.");
  }

  const values = [
    validatedPayload.address,
    validatedPayload.zip,
    validatedPayload.tin || null,
    validatedPayload.mobile,
    validatedPayload.telephone || null,
    validatedPayload.email,
    validatedPayload.payorType,
    hashedPassword
  ];

  // Do not end connections
  // This is part of a TRANSACTION
  // Closing a connections must be handled after COMMIT or ROLLBACK outside of this function

  try {
    const [rows] = await db.query(sql, values);
    return rows.insertId;
  } catch (error) {
    console.error(error);
    throw new Error("There was an error saving your membership information.");
  }
}

export async function isEmailRegistered(email) {
  const sql = "SELECT COUNT(*) as isRegistered FROM members WHERE email = ?";

  const db = await connectDB("sss_contribution");
  if (!db) {
    throw new Error("Cannot connect to the database.");
  }

  let rows;

  try {
    [rows] = await db.query(sql, email);
  } catch (error) {
    console.error(error);
    throw new Error("[Query Error]", error);
  } finally {
    db.end();
  }

  if (rows[0].isRegistered <= 0) {
    return false;
  }

  return true;
}

export async function comparePasswords(hashed, plain) {
  try {
    return await bcrypt.compare(plain, hashed);
  } catch (error) {
    console.error("[Compare Password Error]: ", error);
    throw new Error("Error occured in comparing a password.");
  }
}

export async function signToken(sss_no) {
  try {
    return jwt.sign({ sss_no: sss_no }, process.env.TOKEN_SALT, { expiresIn: "24h" });
  } catch (error) {
    console.error("[Jwt Signing Error]", error);
    throw new Error("An error occured while signing a token.");
  }
}
