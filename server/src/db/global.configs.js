export default {
  sss_no: {
    length: 4
  },
  month: {
    allowedValues: [
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
    ]
  },
  contribution_amount: {
    length: 11,
    min: 200, // custom, not a database metadata
    max: 999999999.99 // custom, not a database metadata
  },
  year: {
    length: 4
  }
};
