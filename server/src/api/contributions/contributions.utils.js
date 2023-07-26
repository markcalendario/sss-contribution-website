import validator from "validator";
import contributionsConfigs from "../../db/configs/contributions.configs.js";
import connectDB from "../../db/connection.js";
import { months } from "../../global/utils/misc.js";
import { isString, isStringEmpty } from "../../global/utils/validators.js";

export function isPeriodRetroactive(month, year) {
  const currentDate = new Date();
  const currentMonth = currentDate
    .toLocaleString("default", { month: "long" })
    .toLowerCase();

  const isYearRetroactive = parseInt(year) < currentDate.getFullYear();
  const isMonthRetroactive =
    months.indexOf(month) < months.indexOf(currentMonth);
  const isYearCurrent = parseInt(year) === currentDate.getFullYear();

  if (isYearRetroactive || (isYearCurrent && isMonthRetroactive)) {
    return true;
  }

  return false;
}

export async function isPeriodAlreadyPaid(month, year, sssNo) {
  const sql =
    "SELECT * FROM contributions WHERE month = ? AND year = ? AND sss_no = ?";
  const values = [month, year, sssNo];

  const db = await connectDB("sss_contribution");
  if (!db) {
    return res.status(500).send({ message: "Cannot connect to the database." });
  }

  let rows;

  try {
    [rows] = await db.query(sql, values);
  } catch (error) {
    console.error("[DB Error]", error);
    throw Error("Error occured while checking data of a period.");
  } finally {
    await db.end();
  }

  if (rows.length > 0) {
    return true;
  }

  return false;
}

export async function hasUnpaidContributions(sssNo) {
  const db = await connectDB("sss_contribution");
  if (!db) {
    throw new Error("Error occured while connecting with database.");
  }

  const sql =
    "SELECT COUNT(*) AS unpaidContributions FROM contributions WHERE sss_no = ? AND payment_reference_number IS NULL";
  const values = [sssNo];

  let rows;

  try {
    [rows] = await db.query(sql, values);
  } catch (error) {
    console.log("[DB Error]", error);
    throw new Error(
      "An error occured while checking for unpaid contributions."
    );
  } finally {
    db.end();
  }

  const numberOfUnpaidContributions = rows[0].unpaidContributions;

  if (numberOfUnpaidContributions === 0) {
    return [false, numberOfUnpaidContributions];
  }

  return [true, numberOfUnpaidContributions];
}

export function isContributionAmountValid(amount, contributionType) {
  if (contributionType !== "sss" && contributionType !== "ec") {
    return [false, "Unknown contribution type."];
  }

  if (!isString(amount)) {
    return [false, `${contributionType} amount must be string.`];
  }

  if (isStringEmpty(amount)) {
    return [false, `${contributionType} amount is required.`];
  }

  const isValidCurrency = validator.isNumeric(amount);
  if (!isValidCurrency) {
    return [false, `${contributionType} amount is not a number.`];
  }

  if (parseFloat(amount) > contributionsConfigs.sss.max) {
    return [
      false,
      `The maximum acceptable ${contributionType} contribution amount is ${contributionsConfigs[contributionType].max}`
    ];
  }

  const isAmountUnderMinRange =
    parseFloat(amount) < contributionsConfigs[contributionType].min;
  if (isAmountUnderMinRange) {
    return [
      false,
      `The minimum acceptable ${contributionType} contribution amount is ${contributionsConfigs[contributionType].min}`
    ];
  }

  return [true, "Contribution amount is valid."];
}

export async function getUnpaidSSSAndECAmount(sssNo) {
  const db = await connectDB("sss_contribution");
  if (!db) {
    return res.send({
      success: false,
      message: "Can't connect with database."
    });
  }

  const sql =
    "SELECT SUM(sss + ec) as toPayAmount FROM contributions WHERE sss_no = ? AND payment_reference_number IS NULL";
  const value = [sssNo];

  let row;
  try {
    [row] = await db.query(sql, value);
  } catch (error) {
    console.error("[DB Error]", error);
    throw new Error("An error occured computing unpaid contribution.");
  } finally {
    db.end();
  }

  const result = row[0];
  return result.toPayAmount;
}

export async function getMonthsWithContributionsOnAYear(sssNo, year) {
  const db = await connectDB("sss_contribution");
  if (!db) {
    return res.send({
      success: false,
      message: "Can't connect with database."
    });
  }

  const sql = "SELECT month FROM contributions WHERE year = ? AND sss_no = ?";
  const values = [year, sssNo];

  let rows;
  try {
    [rows] = await db.query(sql, values);
  } catch (error) {
    console.error("[DB Error]", error);
    throw new Error(
      "An error occured while getting months with contributions."
    );
  } finally {
    db.end();
  }

  let paidMonths = [];

  for (let row of rows) {
    paidMonths.push(row.month);
  }

  return paidMonths;
}
