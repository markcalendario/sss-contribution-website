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
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });

  const isYearRetroactive = parseInt(year) < currentDate.getFullYear();
  const isMonthRetroactive =
    months.indexOf(month.toLowerCase()) < months.indexOf(currentMonth.toLowerCase());

  if (isYearRetroactive || (parseInt(year) === currentDate.getFullYear() && isMonthRetroactive)) {
    return true;
  }

  return false;
}

export async function isPeriodAlreadyPaid(month, year, sssNo) {
  const connection = await connectDB("sss_contribution");
  const sql = "SELECT * FROM contributions WHERE month = ? AND year = ? AND sss_no = ?";
  const values = [month, year, sssNo];
  const [row, fields] = await connection.query(sql, values);
  await connection.end();

  if (row.length > 0) {
    return true;
  }

  return false;
}
