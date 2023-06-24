import connectDB from "../../db/connection.js";
import { decodeAuthToken } from "../../global/utils/jwt.js";

export async function handleIndividualContributionFiling(req, res) {
  const sssNo = decodeAuthToken(req.cookies.auth_token).sss_no;
  const contributions = req.body.contributions;

  const db = await connectDB("sss_contribution");
  if (!db) {
    return res.status(500).send({ message: "Can't connect to database" });
  }

  const sql = "INSERT INTO contributions (sss_no, month, year, sss) VALUES (?,?,?,?)";

  try {
    await db.query("START TRANSACTION");

    for (const contribution of contributions) {
      const values = [sssNo, contribution.month, contribution.year, contribution.sss];
      await db.query(sql, values);
    }

    await db.query("COMMIT");
  } catch (error) {
    console.error("[DB Error]", error);
    await db.query("ROLLBACK");
    return res.send({ success: false, message: "Error occured while filing contribution." });
  } finally {
    db.end();
  }

  return res.send({ success: true, message: "Contribution filed successfully." });
}

export async function handleEmployerContributionFiling(req, res) {
  const sssNo = decodeAuthToken(req.cookies.auth_token).sss_no;
  const contributions = req.body.contributions;

  const db = await connectDB("sss_contribution");
  if (!db) {
    return res.status(500).send({ message: "Can't connect to database" });
  }

  const sql = "INSERT INTO contributions (sss_no, month, year, sss, ec) VALUES (?,?,?,?,?)";

  try {
    await db.query("START TRANSACTION");

    for (const contribution of contributions) {
      const values = [
        sssNo,
        contribution.month,
        contribution.year,
        contribution.sss,
        contribution.ec
      ];
      await db.query(sql, values);
    }

    await db.query("COMMIT");
  } catch (error) {
    console.error("[DB Error]", error);
    await db.query("ROLLBACK");
    return res.send({ success: false, message: "Error occured while filing contribution." });
  } finally {
    db.end();
  }

  return res.send({ success: true, message: "Contribution filed successfully." });
}
