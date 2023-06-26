import connectDB from "../../db/connection.js";
import { decodeAuthToken } from "../../global/utils/jwt.js";
import { hasUnpaidContributions } from "./contributions.utils.js";

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

export async function handleRemoveUnpaidContribution(req, res) {
  const db = await connectDB("sss_contribution");
  if (!db) {
    return res.send({ success: false, message: "Can't connect with database." });
  }

  const sss_no = decodeAuthToken(req.cookies.auth_token).sss_no;
  try {
    const [isHasUnpaid] = await hasUnpaidContributions(sss_no);

    if (!isHasUnpaid) {
      return res.send({
        success: false,
        message: `You don't have unpaid contributions to remove.`
      });
    }
  } catch (error) {
    console.error(error);
    return res.send({
      success: false,
      message: "An error occured while checking pending payments."
    });
  }

  const sql = "DELETE FROM contributions WHERE payment_reference_number IS NULL AND sss_no = ?";
  const values = [sss_no];

  let resultSetHeader;
  try {
    [resultSetHeader] = await db.query(sql, values);
  } catch (error) {
    console.error(error);
    return res.send({
      success: false,
      message: "An error occured while deleting your unpaid contributions."
    });
  }

  if (resultSetHeader.affectedRows === 0) {
    return res.send({
      success: false,
      message: `You don't have unpaid contributions to remove.`
    });
  }

  return res.send({
    success: true,
    message: `You have successfully removed ${resultSetHeader.affectedRows} of your unpaid contributions.`
  });
}
