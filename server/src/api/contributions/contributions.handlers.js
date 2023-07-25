import moment from "moment/moment.js";
import connectDB from "../../db/connection.js";
import { decodeAuthToken } from "../../global/utils/jwt.js";
import { months } from "../../global/utils/misc.js";
import {
  getMonthsWithContributionsOnAYear,
  getUnpaidSSSAndECAmount,
  hasUnpaidContributions
} from "./contributions.utils.js";

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
    return res.send({
      success: false,
      message: "Error occured while filing contribution."
    });
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
    return res.send({
      success: false,
      message: "Error occured while filing contribution."
    });
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
    return res.send({
      success: false,
      message: "You do not have pending contributions to pay."
    });
  }

  // Get unpaid SSS and EC amount of a Payor
  // Take note: This handler is used by both types of members
  // Computing the EC of Individual Payor will not affect the computation because they have no EC

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
    return res.send({
      success: false,
      message: `Please pay exactly Php ${unpaidSSSAmount}.`
    });
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
    "SELECT CONCAT(UPPER(SUBSTRING(month, 1, 1)), SUBSTRING(month, 2), ' ', year) as period, sss, ec, CASE WHEN mode = 'check' THEN UPPER(CONCAT(check_reference, ' | ', bank)) WHEN mode = 'bank' THEN UPPER(CONCAT(mode, ' | ', bank)) ELSE 'CASH' END as mode, DATE_FORMAT(payment_date, '%b %e, %Y %l:%i %p') as paid_date FROM contributions INNER JOIN payments ON contributions.payment_reference_number = payments.reference_number WHERE sss_no = ? ORDER BY payment_date DESC, STR_TO_DATE(CONCAT(UPPER(SUBSTR(month, 1, 1)), SUBSTR(month, 2), ' 01 ', year), '%M %d %Y') DESC";
  const values = [sssNo];

  let rows;
  try {
    [rows] = await db.query(sql, values);
  } catch (error) {
    console.error(error);
    return res.send({ success: false, message: "Can't get contribution history." });
  } finally {
    db.end();
  }

  return res.send({
    success: true,
    message: "The contribution history is fetched successfully.",
    history: rows
  });
}

export async function handleGetAvailablePeriods(req, res) {
  const sssNo = decodeAuthToken(req.cookies.auth_token).sss_no;

  let hasUnpaid;
  try {
    [hasUnpaid] = await hasUnpaidContributions(sssNo);
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }

  if (hasUnpaid) {
    return res.send({
      success: false,
      message: "You still have pending contributions to pay.",
      hasPendingFiledContributions: true
    });
  }

  // Get current month and year.
  const currentMonth = moment().format("MMMM").toLowerCase();
  const currentYear = moment().year();

  // Get all months with contributions in the current year.
  let paidMonths;
  try {
    paidMonths = await getMonthsWithContributionsOnAYear(sssNo, currentYear);
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }

  let availablePeriods = [];
  let monthCursor = months.indexOf(currentMonth);
  let yearCursor = currentYear;

  // Collect 12 periods by iterating until the end month of the current year.
  while (availablePeriods.length !== 12) {
    const monthToCheck = months[monthCursor];

    // Check if the month is not in the paidMonths.
    if (!paidMonths.includes(monthToCheck)) {
      // If it is not in the paidMonths, add it as an available period.
      availablePeriods.push({ month: monthToCheck, year: yearCursor.toString() });
    }

    monthCursor++;

    // If the month reaches December of the current year, increment the yearCursor and reset the monthCursor to 0.
    if (monthCursor === months.length) {
      yearCursor++;
      monthCursor = 0;

      // Collect all of the paid months on the incremented yearCursor
      try {
        paidMonths = await getMonthsWithContributionsOnAYear(sssNo, yearCursor);
      } catch (error) {
        return res.send({ success: false, message: error.message });
      }
    }
  }

  return res.send({ success: true, availablePeriods: availablePeriods });
}

export async function handleGetUnpaidContributions(req, res) {
  const db = await connectDB("sss_contribution");
  if (!db) {
    return res.send({ success: false, message: "Can't connect with database." });
  }

  const sssNo = decodeAuthToken(req.cookies.auth_token).sss_no;

  const sql =
    "SELECT CONCAT(UPPER(SUBSTR(month, 1, 1)), SUBSTR(month, 2), ' ', year) as period, sss,ec, DATE_FORMAT(filing_date, '%M %e, %Y, %h:%i %p') as filing_date FROM contributions WHERE payment_reference_number IS NULL AND sss_no = ? ORDER BY year DESC, CASE month WHEN 'january' THEN 1 WHEN 'february' THEN 2 WHEN 'march' THEN 3 WHEN 'april' THEN 4 WHEN 'may' THEN 5 WHEN 'june' THEN 6 WHEN 'july' THEN 7 WHEN 'august' THEN 8 WHEN 'september' THEN 9 WHEN 'october' THEN 10 WHEN 'november' THEN 11 WHEN 'december' THEN 12 ELSE 13 END DESC";
  const values = [sssNo];

  let rows;
  try {
    [rows] = await db.query(sql, values);
  } catch (error) {
    console.error("[DB Error]", error);
    return res.send({
      success: false,
      message: "An errror occured while fetching unpaid contributions."
    });
  } finally {
    db.end();
  }

  res.send({
    success: true,
    message: "Success fetching unpaid contributions.",
    data: rows
  });
}

export async function handleGetUnpaidContributionsAmount(req, res) {
  const sssNo = decodeAuthToken(req.cookies.auth_token).sss_no;

  let unpaidAmount;

  try {
    unpaidAmount = await getUnpaidSSSAndECAmount(sssNo);
  } catch (error) {
    return res.send({
      success: false,
      message: "An error occured while getting unpaid contributions amount."
    });
  }

  res.send({
    success: true,
    message: "Success fetching unpaid contributions.",
    amount: unpaidAmount
  });
}
