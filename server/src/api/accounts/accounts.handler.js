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
  const fetchedData = rows[0];

  if (isEmpty(fetchedData)) {
    return res.status(404).send({ success: false, message: "We cannot determine the role." });
  }

  return res.send({ success: true, message: "Success fetching role.", role: fetchedData.role });
}
