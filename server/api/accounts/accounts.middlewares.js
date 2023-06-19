const individualConfigs = require("../../db/individual.configs");
const employersConfigs = require("../../db/employers.configs");
const validator = require("validator");
const { validateMemberRegistrationPayloads } = require("./accounts.utils");
const { isEmpty } = require("../../utils/validators");

async function validateIndividualRegistrationPayloads(req, res, next) {
  const payload = req.body;

  // Member payload validation

  try {
    await validateMemberRegistrationPayloads(payload);
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }

  // Individual payload validation
  // CRN

  if (isEmpty(payload.crn)) {
    return res.send({ success: false, message: "12-digit CRN is required." });
  }

  if (
    payload.crn.length < individualConfigs.crn.min ||
    payload.crn.length > individualConfigs.crn.max
  ) {
    return res.send({ success: false, message: "CRN must consist 12 digits." });
  }

  // First Name

  if (isEmpty(payload.firstName)) {
    return res.send({ success: false, message: "First name is required." });
  }

  if (payload.firstName.length > individualConfigs.first_name.length) {
    return res.send({ success: false, message: "Too many characters for a first name." });
  }

  // Middle Name

  if (isEmpty(payload.middleName)) {
    return res.send({ success: false, message: "Middle name is required." });
  }

  if (payload.middleName.length > individualConfigs.middle_name.length) {
    return res.send({ success: false, message: "Too many characters for a middle name." });
  }

  // Last Name

  if (isEmpty(payload.lastName)) {
    return res.send({ success: false, message: "Last name is required." });
  }

  if (payload.lastName.length > individualConfigs.last_name.length) {
    return res.send({ success: false, message: "Too many characters for a last name." });
  }

  // Suffix

  if (!isEmpty(payload.suffix) && payload.suffix.length > individualConfigs.suffix.length) {
    return res.send({ success: false, message: "Too many characters for a name suffix." });
  }

  next();
}

async function validateEmployerRegistrationPayloads(req, res, next) {
  const payload = req.body;

  // Member payload validation

  try {
    await validateMemberRegistrationPayloads(payload);
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }

  // Employer member data payload validation

  if (!isEmpty(payload.website) && !validator.isURL(payload.website)) {
    return res.send({
      success: false,
      message: "Invalid website link. Include http/https protocol."
    });
  }

  if (isEmpty(payload.businessName)) {
    return res.send({ success: false, message: "Business name is required." });
  }

  if (payload.businessName.length > employersConfigs.business_name.length) {
    return res.send({ success: false, message: "Too many characters for a business name." });
  }

  next();
}

module.exports = { validateIndividualRegistrationPayloads, validateEmployerRegistrationPayloads };
