import connectDB from "../../db/connection.js";
import { decodeAuthToken } from "../../global/utils/jwt.js";

export async function handleIndividualContributionFiling(req, res) {
  const sssNo = decodeAuthToken(req.cookies.auth_token).sss_no;
  const contributions = req.body.contributions;

  let connection = await connectDB("sss_contribution");

  if (!connection) {
    return res.status(500).send({ message: "Can't connect to database" });
  }

  const sql = "INSERT INTO contributions (sss_no, month, year, amount) VALUES (?,?,?,?)";

  try {
    await connection.query("START TRANSACTION");

    for (const contribution of contributions) {
      const values = [sssNo, contribution.month, contribution.year, contribution.amount];
      await connection.query(sql, values);
    }

    await connection.query("COMMIT");
  } catch (error) {
    console.error("[DB Error]", error);
    await connection.query("ROLLBACK");
    return res.send({ success: false, message: "Error occured while filing contribution." });
  } finally {
    connection.end();
  }

  res.send({ success: true, message: "Contribution filed successfully." });
}
