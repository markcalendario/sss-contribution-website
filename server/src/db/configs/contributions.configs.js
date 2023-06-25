import globalConfigs from "./global.configs.js";

export default {
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
  sss: {
    min: 200, // custom, not a database metadata
    max: 999999999.99 // custom, not a database metadata
  },
  ec: {
    min: 200, // custom, not a database metadata
    max: 999999999.99 // custom, not a database metadata
  },
  year: {
    minLength: 4,
    maxLength: 4
  }
};
