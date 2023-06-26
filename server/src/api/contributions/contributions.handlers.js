import connectDB from "../../db/connection.js";
import { decodeAuthToken } from "../../global/utils/jwt.js";
import { getUnpaidSSSAndECAmount, hasUnpaidContributions } from "./contributions.utils.js";

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
    db.end();
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
  } finally {
    db.end();
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

export async function handlePayContribution(req, res) {
  const { amount, mode, bank, checkReference, checkDate } = req.body;
  const sss_no = decodeAuthToken(req.cookies.auth_token).sss_no;
  // Check if has no unpaid contributions
  let hasUnpaidContribs;

  try {
    [hasUnpaidContribs] = await hasUnpaidContributions(sss_no);
  } catch (error) {
    return res.send({
      success: false,
      message: "A database error occured while checking unpaid contributions."
    });
  }

  if (!hasUnpaidContribs) {
    return res.send({ success: false, message: "You do not have pending contributions to pay." });
  }

  // Get unpaid SSS and EC amount
  // Take note! The individual member has always no EC contribution in the database.
  // However, this program still take it but it does not have an effect in the computation.
  // Purpose: To make /pay endpoint usable for both member.

  let unpaidSSSAmount;

  try {
    unpaidSSSAmount = parseFloat(await getUnpaidSSSAndECAmount(sss_no));
  } catch (error) {
    return res.send({
      success: false,
      message: error.message
    });
  }

  // Return if user is not paying an exact amount

  if (parseFloat(amount) !== unpaidSSSAmount) {
    return res.send({ success: false, message: `Please pay exactly Php ${unpaidSSSAmount}.` });
  }

  // Start a transaction

  const db = await connectDB("sss_contribution");
  if (!db) {
    return res.send({ success: false, message: "Can't connect with database." });
  }

  try {
    await db.query("START TRANSACTION");
  } catch (error) {
    db.end();
    console.error(error);
    return res.send({
      success: false,
      message: "A database error occured while preparing your payments."
    });
  }

  // Submit payment

  const sql =
    "INSERT INTO payments (amount, mode, bank, check_reference, check_date) VALUES (?,?,?,?,?)";
  const values = [unpaidSSSAmount, mode, bank, checkReference, checkDate];
  let paymentReferenceNumber;

  try {
    const [result] = await db.query(sql, values);
    paymentReferenceNumber = result.insertId;
  } catch (error) {
    console.error(error);
    await db.query("ROLLBACK");
    db.end();
    return res.send({
      success: false,
      message: "A database error occured while initiating your payments."
    });
  }

  // Assign payment reference number to unpaid contributions

  const sql2 =
    "UPDATE contributions SET payment_reference_number = ? WHERE payment_reference_number IS NULL AND sss_no = ?";
  const values2 = [paymentReferenceNumber, sss_no];

  try {
    await db.query(sql2, values2);
    await db.query("COMMIT");
  } catch (error) {
    console.error(error);
    await db.query("ROLLBACK");
    return res.send({
      success: false,
      message: "A database error occured while saving your payments."
    });
  } finally {
    db.end();
  }

  return res.send({
    success: true,
    message: `You have successfully paid ${unpaidSSSAmount}.`
  });
}

export async function handleHistory(req, res) {
  const db = await connectDB("sss_contribution");
  if (!db) {
    return res.send({ success: false, message: "Can't connect with database." });
  }

  const sssNo = decodeAuthToken(req.cookies.auth_token).sss_no;

  const sql =
    "SELECT CONCAT(UPPER(SUBSTRING(month, 1, 1)), UPPER(SUBSTRING(month, 2)), ' ', year) as period, sss, ec, mode, DATE_FORMAT(payment_date, '%b %e, %Y') as paid_date FROM contributions INNER JOIN payments ON contributions.payment_reference_number = payments.reference_number WHERE sss_no = ? ORDER BY paid_date DESC";
  const values = [sssNo];

  let rows;
  try {
    [rows] = await db.query(sql, values);
  } catch (error) {
    console.error(error);
    return res.send({ success: false, message: "Can't get contribution history." });
  }

  return res.send({
    success: true,
    message: "The contribution history is fetched successfully.",
    history: rows
  });
}
