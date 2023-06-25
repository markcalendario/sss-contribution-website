import configs from "./global.configs.js";

export default {
  sss_no: {
    ...configs.sss_no
  },
  crn: {
    minLength: 12,
    maxLength: 12
  },
  first_name: {
    maxLength: 30
  },
  middle_name: {
    maxLength: 30
  },
  last_name: {
    maxLength: 30
  },
  suffix: {
    maxLength: 10
  }
};
