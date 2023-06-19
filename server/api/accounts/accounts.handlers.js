const connectDB = require("../../db/connection");
const { saveMemberData } = require("./accounts.utils");

async function handleMemberRegistration(req, res) {
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
    payload.telephone,
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

async function handleEmployerRegistration(req, res) {
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

module.exports = { handleMemberRegistration, handleEmployerRegistration };
