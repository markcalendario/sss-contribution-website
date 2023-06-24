import connectDB from "../../db/connection.js";

export function isPeriodRetroactive(month, year) {
  const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december"
  ];

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" }).toLowerCase();

  const isYearRetroactive = parseInt(year) < currentDate.getFullYear();
  const isMonthRetroactive = months.indexOf(month) < months.indexOf(currentMonth);
  const isYearCurrent = parseInt(year) === currentDate.getFullYear();

  if (isYearRetroactive || (isYearCurrent && isMonthRetroactive)) {
    return true;
  }

  return false;
}

export async function isPeriodAlreadyPaid(month, year, sssNo) {
  const sql = "SELECT * FROM contributions WHERE month = ? AND year = ? AND sss_no = ?";
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
    "SELECT COUNT(*) AS unpaidContributions FROM contributions LEFT JOIN payments ON contributions.sss_no = payments.sss_no AND contributions.month = payments.month AND contributions.year = payments.year WHERE contributions.sss_no = ? AND payments.sss_no IS NULL;";
  const values = [sssNo];

  let rows;

  try {
    [rows] = await db.query(sql, values);
  } catch (error) {
    console.log("[DB Error]", error);
    throw new Error("An error occured while checking for unpaid contributions.");
  } finally {
    db.end();
  }

  return rows[0].unpaidContributions;
}