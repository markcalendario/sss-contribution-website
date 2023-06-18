const membersConfigs = require("../../db/members.configs");
const validator = require("validator");

function validateMemberRegistrationPayloads(req, res, next) {
  const payload = req.body;

  if (validator.isEmpty(payload.address)) {
    return res.send({ message: "Complete address is required." });
  }

  if (payload.address.length > membersConfigs.address.length) {
    return res.send({ message: "Too many characters for an address." });
  }

  if (validator.isEmpty(payload.zip)) {
    return res.send({ message: "Zip code is required." });
  }

  if (payload.zip.length > membersConfigs.zip.length) {
    return res.send({ message: "Too many characters for ZIP Code." });
  }

  if (validator.isEmpty(payload.tin)) {
    return res.send({ message: "TIN is required." });
  }

  if (payload.tin.length > membersConfigs.tin.length) {
    return res.send({ message: "Too many characters for TIN." });
  }

  if (validator.isEmpty(payload.mobile)) {
    return res.send({ message: "Mobile number is required." });
  }

  if (payload.mobile.length > membersConfigs.mobile.length) {
    return res.send({ message: "Invalid mobile number." });
  }

  if (validator.isEmpty(payload.telephone)) {
    return res.send({ message: "Telephone number is required." });
  }

  if (payload.telephone.length > membersConfigs.telephone.length) {
    return res.send({ message: "Invalid telephone number." });
  }

  if (validator.isEmpty(payload.payorType)) {
    return res.send({ message: "Please select a payor type." });
  }

  if (!membersConfigs.payorType.allowedValues.includes(payload.payorType)) {
    return res.send({ message: "Unacceptable payor type." });
  }

  if (payload.payorType.length > membersConfigs.payorType.length) {
    return res.send({ message: "Invalid payor type." });
  }

  if (!validator.isEmail(payload.email)) {
    return res.send({ message: "Please provide a valid email." });
  }

  if (payload.email.length > membersConfigs.email.length) {
    return res.send({ message: "Too many characters for an email address." });
  }

  if (payload.password.length > membersConfigs.max) {
    return res.send({ message: "Too many password characters." });
  }

  if (payload.password.length < membersConfigs.min) {
    return res.send({ message: "Weak password." });
  }

  next();
}

module.exports = { validateMemberRegistrationPayloads };
