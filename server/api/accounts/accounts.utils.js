const bcrypt = require("bcrypt");
const membersConfigs = require("../../db/members.configs");
const validator = require("validator");
const connectDB = require("../../db/connection");
const { isEmpty } = require("../../utils/validators");

function hashPassword(plainPassword) {
  return bcrypt.hashSync(plainPassword, 10);
}

/**
 * Check if email is registered.
 */
async function isEmailRegistered(email) {
  const connection = await connectDB("sss_contribution");
  const sql = "SELECT COUNT(*) as isRegistered FROM members WHERE email = ?";
  const [result, fields] = await connection.query(sql, email);
  await connection.end();

  if (result[0].isRegistered <= 0) {
    return false;
  }

  return true;
}

async function saveMemberData(db, validatedPayload) {
  const sql =
    "INSERT INTO members (address, zip, tin, mobile, telephone, email, payor_type, password) VALUES (?,?,?,?,?,?,?,?)";

  const values = [
    validatedPayload.address,
    validatedPayload.zip,
    validatedPayload.tin,
    validatedPayload.mobile,
    validatedPayload.telephone,
    validatedPayload.email,
    validatedPayload.payorType,
    hashPassword(validatedPayload.password)
  ];

  try {
    const [rows, fields] = await db.query(sql, values);
    return rows.insertId;
  } catch {
    throw new Error("There was an error saving your membership information.");
  }
}

async function validateMemberRegistrationPayloads(payload) {
  // Address

  if (isEmpty(payload.address)) {
    throw new Error("Complete address is required.");
  }

  if (payload.address.length > membersConfigs.address.length) {
    throw new Error("Too many characters for an address.");
  }

  // Zip

  if (isEmpty(payload.zip)) {
    throw new Error("Zip code is required.");
  }

  if (payload.zip.length > membersConfigs.zip.length) {
    throw new Error("Too many characters for ZIP Code.");
  }

  // TIN

  if (isEmpty(payload.tin)) {
    throw new Error("TIN is required.");
  }

  if (payload.tin.length < membersConfigs.tin.min || payload.tin.length > membersConfigs.tin.max) {
    throw new Error("TIN number must consists 12 digits.");
  }

  // Mobile

  if (isEmpty(payload.mobile)) {
    throw new Error("11-digit (PH standard format, ex. 09xxxxxxxxx) mobile number is required.");
  }

  if (
    payload.mobile.length < membersConfigs.mobile.min ||
    payload.mobile.length > membersConfigs.mobile.max
  ) {
    throw new Error("Mobile number must consists 11-digit (PH standard format, ex. 09xxxxxxxxx).");
  }

  // Telephone

  if (isEmpty(payload.telephone)) {
    throw new Error("Telephone number is required.");
  }

  if (
    payload.telephone.length < membersConfigs.telephone.min ||
    payload.telephone.length > membersConfigs.telephone.max
  ) {
    throw new Error("Invalid telephone number. You may include area code Ex. (02)xxxxxx...");
  }

  // Payor Type

  if (isEmpty(payload.payorType)) {
    throw new Error("Please select a payor type.");
  }

  if (!membersConfigs.payorType.allowedValues.includes(payload.payorType)) {
    throw new Error("Unacceptable payor type.");
  }

  if (payload.payorType.length > membersConfigs.payorType.length) {
    throw new Error("Invalid payor type.");
  }

  // Email

  if (isEmpty(payload.email)) {
    throw new Error("Email is required.");
  }

  if (!validator.isEmail(payload.email)) {
    throw new Error("Please provide a valid email.");
  }

  if (await isEmailRegistered(payload.email)) {
    throw new Error("Email is already registered. Try signing in.");
  }

  if (payload.email.length > membersConfigs.email.length) {
    throw new Error("Too many characters for an email address.");
  }

  // Password

  if (isEmpty(payload.password)) {
    throw new Error("Password is required.");
  }

  if (payload.password.length > membersConfigs.password.max) {
    throw new Error("Too many password characters.");
  }

  if (payload.password.length < membersConfigs.password.min) {
    throw new Error("Weak password.");
  }
}

module.exports = {
  hashPassword,
  isEmailRegistered,
  saveMemberData,
  validateMemberRegistrationPayloads
};
