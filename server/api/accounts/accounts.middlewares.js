const connectDB = require("../../db/connection");
const individualConfigs = require("../../db/individual.configs");
const membersConfigs = require("../../db/members.configs");
const validator = require("validator");
const { isEmailRegistered } = require("./accounts.utils");

async function validateMemberRegistrationPayloads(req, res, next) {
  const payload = req.body;

  if (validator.isEmpty(payload.address)) {
    return res.send({ success: false, message: "Complete address is required." });
  }

  if (payload.address.length > membersConfigs.address.length) {
    return res.send({ success: false, message: "Too many characters for an address." });
  }

  if (validator.isEmpty(payload.zip)) {
    return res.send({ success: false, message: "Zip code is required." });
  }

  if (payload.zip.length > membersConfigs.zip.length) {
    return res.send({ success: false, message: "Too many characters for ZIP Code." });
  }

  if (validator.isEmpty(payload.tin)) {
    return res.send({ success: false, message: "TIN is required." });
  }

  if (payload.tin.length < membersConfigs.tin.min || payload.tin.length > membersConfigs.tin.max) {
    return res.send({ success: false, message: "TIN number must consists 12 digits." });
  }

  if (validator.isEmpty(payload.mobile)) {
    return res.send({
      message: "11-digit (PH standard format, ex. 09xxxxxxxxx) mobile number is required."
    });
  }

  if (
    payload.mobile.length < membersConfigs.mobile.min ||
    payload.mobile.length > membersConfigs.mobile.max
  ) {
    return res.send({
      message: "Mobile number must consists 11-digit (PH standard format, ex. 09xxxxxxxxx)."
    });
  }

  if (validator.isEmpty(payload.telephone)) {
    return res.send({ success: false, message: "Telephone number is required." });
  }

  if (
    payload.telephone.length < membersConfigs.telephone.min ||
    payload.telephone.length > membersConfigs.telephone.max
  ) {
    return res.send({
      message: "Invalid telephone number. You may include area code Ex. (02)xxxxxx..."
    });
  }

  if (validator.isEmpty(payload.payorType)) {
    return res.send({ success: false, message: "Please select a payor type." });
  }

  if (!membersConfigs.payorType.allowedValues.includes(payload.payorType)) {
    return res.send({ success: false, message: "Unacceptable payor type." });
  }

  if (payload.payorType.length > membersConfigs.payorType.length) {
    return res.send({ success: false, message: "Invalid payor type." });
  }

  if (!validator.isEmail(payload.email)) {
    return res.send({ success: false, message: "Please provide a valid email." });
  }

  if (await isEmailRegistered(payload.email)) {
    return res.send({ success: false, message: "Email is already registered. Try signing in." });
  }

  if (payload.email.length > membersConfigs.email.length) {
    return res.send({ success: false, message: "Too many characters for an email address." });
  }

  if (validator.isEmpty(payload.password)) {
    return res.send({ success: false, message: "Password is required." });
  }

  if (payload.password.length > membersConfigs.password.max) {
    return res.send({ success: false, message: "Too many password characters." });
  }

  if (payload.password.length < membersConfigs.password.min) {
    return res.send({ success: false, message: "Weak password." });
  }

  // individual member checking

  if (validator.isEmpty(payload.crn)) {
    return res.send({ success: false, message: "12-digit CRN is required." });
  }

  if (
    payload.crn.length < individualConfigs.crn.min ||
    payload.crn.length > individualConfigs.crn.max
  ) {
    return res.send({ success: false, message: "CRN must consist 12 digits." });
  }

  if (validator.isEmpty(payload.firstName)) {
    return res.send({ success: false, message: "First name is required." });
  }

  if (payload.firstName.length > individualConfigs.first_name.length) {
    return res.send({ success: false, message: "Too many characters for a first name." });
  }

  if (validator.isEmpty(payload.middleName)) {
    return res.send({ success: false, message: "Middle name is required." });
  }

  if (payload.middleName.length > individualConfigs.middle_name.length) {
    return res.send({ success: false, message: "Too many characters for a middle name." });
  }

  if (validator.isEmpty(payload.lastName)) {
    return res.send({ success: false, message: "Last name is required." });
  }

  if (payload.lastName.length > individualConfigs.last_name.length) {
    return res.send({ success: false, message: "Too many characters for a last name." });
  }

  if (
    !validator.isEmpty(payload.suffix) &&
    payload.suffix.length > individualConfigs.suffix.length
  ) {
    return res.send({ success: false, message: "Too many characters for a name suffix." });
  }

  next();
}

module.exports = { validateMemberRegistrationPayloads };
