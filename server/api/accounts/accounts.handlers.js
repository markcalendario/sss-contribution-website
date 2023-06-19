const connectDB = require("../../db/connection");
const { hashPassword } = require("./accounts.utils");

async function handleMemberRegistration(req, res) {
  const db = await connectDB("sss_contribution");
  const payload = req.body;
  db.query("START TRANSACTION");

  let lastInsertedID;
  let sql =
    "INSERT INTO members (address, zip, tin, mobile, telephone, email, payor_type, password) VALUES (?,?,?,?,?,?,?,?)";
  let values = [
    payload.address,
    payload.zip,
    payload.tin,
    payload.mobile,
    payload.telephone,
    payload.email,
    payload.payorType,
    hashPassword(payload.password)
  ];

  try {
    const [rows, fields] = await db.query(sql, values);
    lastInsertedID = rows.insertId;
  } catch (error) {
    db.query("ROLLBACK");
    db.end();
    return res.status(500).send({ success: false, message: "There was an error in the database." });
  }

  let sql2 =
    "INSERT INTO individual (sss_no, crn, first_name, last_name, middle_name, suffix) VALUES (?,?,?,?,?,?)";

  let values2 = [
    lastInsertedID,
    payload.crn,
    payload.firstName,
    payload.lastName,
    payload.telephone,
    payload.middleName,
    payload.suffix
  ];

  try {
    await db.query(sql2, values2);
  } catch (error) {
    db.query("ROLLBACK");
    db.end();
    return res.status(500).send({ success: false, message: "There was an error in the database." });
  }

  db.query("COMMIT");
  db.end();

  return res.send({ success: true, message: "SSS account is successfully registered." });
}

module.exports = { handleMemberRegistration };
