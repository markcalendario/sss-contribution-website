import connectDB from "../../db/connection.js";
import { decodeAuthToken } from "../../global/utils/jwt.js";
import { isEmpty } from "../../global/utils/validators.js";

export async function handleGetRole(req, res) {
  const connection = await connectDB("sss_contribution");
  const sssNo = decodeAuthToken(req.cookies.auth_token).sss_no;

  const sql =
    "SELECT IF (EXISTS (SELECT 1 FROM individual WHERE sss_no = ?), 'Individual', 'Employer') As role FROM members;";
  const value = [sssNo];

  const [rows, fields] = await connection.query(sql, value);
  await connection.end();

  const fetchedData = rows[0];

  if (isEmpty(fetchedData)) {
    return res.status(404).send({ success: false, message: "We cannot determine the role." });
  }

  return res.send({ success: true, message: "Success fetching role.", role: fetchedData.role });
}

export async function handleGetIndividualMemberInfo(req, res) {
  const connection = await connectDB("sss_contribution");
  const sssNo = decodeAuthToken(req.cookies.auth_token).sss_no;

  const sql =
    "SELECT members.sss_no, crn, first_name, last_name, middle_name, suffix, address, zip, tin, mobile, telephone, payor_type, email FROM members INNER JOIN individual ON individual.sss_no = members.sss_no WHERE members.sss_no = ?;";
  const values = [sssNo];
  const [row, fields] = await connection.query(sql, values);
  await connection.end();

  // Do not validate if the row will return any value from the individual table because IT WILL.
  // The sss_no in auth_token has already been validated by the middleware isIndividualMember

  res.send({
    success: true,
    message: "Success fetching individual member information.",
    data: row[0]
  });
}

export async function handleGetEmployerMemberInfo(req, res) {
  const connection = await connectDB("sss_contribution");
  const sssNo = decodeAuthToken(req.cookies.auth_token).sss_no;

  const sql =
    "SELECT members.sss_no, business_name, website, address, zip, tin, mobile, telephone, payor_type, email FROM members INNER JOIN employers ON employers.sss_no = members.sss_no WHERE members.sss_no = ?;";
  const values = [sssNo];
  const [row, fields] = await connection.query(sql, values);
  await connection.end();

  // Do not validate if the row will return any value from the employer table because IT WILL.
  // The sss_no in auth_token has already been validated by the middleware isEmployerMember

  res.send({
    success: true,
    message: "Success fetching employer member information.",
    data: row[0]
  });
}
