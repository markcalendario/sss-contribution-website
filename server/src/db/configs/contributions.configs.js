import configs from "./global.configs.js";

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
    ...configs.sss_amount
  },
  ec: {
    ...configs.ec_amount
  },
  year: {
    minLength: 4,
    maxLength: 4
  }
};
