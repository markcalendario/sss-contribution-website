import connectDB from "../../db/connection.js";
import { decodeAuthToken } from "../../global/utils/jwt.js";

export async function handleIndividualContributionFiling(req, res) {
  const sssNo = decodeAuthToken(req.cookies.auth_token).sss_no;
  const connection = await connectDB("sss_contribution");
  const contributions = req.body.contributions;

  await connection.query("START TRANSACTION");

  for (const contribution of contributions) {
    const sql = "INSERT INTO contributions (sss_no, month, year, amount) VALUES (?,?,?,?)";
    const values = [sssNo, contribution.month, contribution.year, contribution.amount];

    try {
      await connection.query(sql, values);
    } catch (error) {
      console.error("[Query Error]", error);
      await connection.query("ROLLBACK");
      return res.send({ success: false, message: "Error occured while filing contribution." });
    }
  }

  await connection.query("COMMIT");
  await connection.end();

  res.send({ success: true, message: "Contribution filed successfully." });
}
