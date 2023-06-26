export default {
  reference_number: {}, // left empty because it is auto increment
  amount: {
    min: 0,
    max: 1999999999.98
  },
  mode: {
    allowedValues: ["bank", "check", "cash"]
  },
  bank: {
    maxLength: 45
  },
  check_reference: {
    maxLength: 15
  },
  check_date: {}
};
