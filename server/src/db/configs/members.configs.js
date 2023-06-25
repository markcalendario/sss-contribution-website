import configs from "./global.configs.js";

export default {
  sss_no: {
    ...configs.sss_no
  },
  address: {
    maxLength: 100,
    minLength: 5
  },
  zip: {
    maxLength: 4,
    minLength: 4
  },
  tin: {
    maxLength: 12,
    minLength: 12
  },
  mobile: {
    minLength: 11,
    maxLength: 11
  },
  telephone: {
    minLength: 7,
    maxLength: 15
  },
  payorType: {
    allowedValues: [
      "business",
      "household",
      "self-employed",
      "ofw",
      "farmer/fisherman",
      "non-working spouse",
      "voluntary"
    ]
  },
  email: {
    maxLength: 100,
    minLength: 6 // worse case: a@a.a
  },
  password: {
    minLength: 6,
    maxLength: 16
  }
};
