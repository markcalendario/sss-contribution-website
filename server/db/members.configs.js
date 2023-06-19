module.exports = {
  sss_no: {
    length: 10
  },
  address: {
    length: 100
  },
  zip: {
    length: 9,
    type: "number"
  },
  tin: {
    length: 12,
    min: 12,
    max: 12
  },
  mobile: {
    length: 11,
    min: 11,
    max: 11
  },
  telephone: {
    length: 15,
    min: 7,
    max: 15
  },
  payorType: {
    length: 18,
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
    length: 100
  },
  password: {
    length: 72, // ignore this in input validation, it's the number of characters in a Bcypt hashing
    min: 4,
    max: 16
  }
};
