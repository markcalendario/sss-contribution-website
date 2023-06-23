import validator from "validator";
import individualConfigs from "../../db/configs/individual.configs.js";
import employersConfigs from "../../db/configs/employers.configs.js";

import { validateMemberRegistrationPayloads, isEmailRegistered } from "./authentications.utils.js";
import { isEmpty } from "../../global/utils/validators.js";

export async function validateIndividualRegistrationPayloads(req, res, next) {
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

export async function validateEmployerRegistrationPayloads(req, res, next) {
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

export async function validateLoginPayloads(req, res, next) {
  const payload = req.body;

  if (isEmpty(payload.email)) {
    return res.send({ success: false, message: "Email address is required." });
  }

  if (!validator.isEmail(payload.email)) {
    return res.send({
      success: false,
      message: "The email address you provided is not a valid email address."
    });
  }

  if (!(await isEmailRegistered(payload.email))) {
    return res.send({
      success: false,
      message: "The email address you provided is not registered. Try signing up instead."
    });
  }

  if (isEmpty(payload.password)) {
    return res.send({ success: false, message: "Password is required." });
  }

  next();
}
