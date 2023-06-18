const connectDB = require("../../db/connection");
const { hashPassword } = require("./accounts.utils");

async function handleMemberRegistration(req, res) {
  const db = connectDB("sss_contribution");
  const payload = req.body;

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

  let insertedID = await new Promise((resolve) => {
    db.query(sql, values, (error, result) => {
      if (error)
        return res
          .status(500)
          .send({ error: true, message: "There was an error in the database." });

      resolve(result.insertId);
    });
  });

  sql =
    "INSERT INTO individual (sss_no, crn, first_name, last_name, middle_name, suffix) VALUES (?,?,?,?,?,?)";

  values = [
    insertedID,
    payload.crn,
    payload.firstName,
    payload.lastName,
    payload.telephone,
    payload.middleName,
    payload.suffix
  ];

  db.query(sql, values, (error, result) => {
    if (error) {
      return res
        .status(500)
        .send({ error: true, message: "There was an error in the database. Rollback applied." });
    }
    res.send({ message: "success" });
  });
}

module.exports = { handleMemberRegistration };
