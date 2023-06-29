import { months } from "../../global/utils/misc.js";
import configs from "./global.configs.js";

export default {
  month: {
    allowedValues: months
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
