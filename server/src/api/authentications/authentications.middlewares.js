import validator from "validator";
import individualConfigs from "../../db/configs/individual.configs.js";
import employersConfigs from "../../db/configs/employers.configs.js";
import membersConfigs from "../../db/configs/members.configs.js";

import { isEmailRegistered } from "./authentications.utils.js";
import { isEmpty } from "../../global/utils/validators.js";

export async function validateMemberRegistrationPayload(req, res, next) {
  const payload = req.body;

  // Address

  if (isEmpty(payload.address)) {
    return res.send({ success: false, message: "Complete address is required." });
  }

  if (payload.address.length > membersConfigs.address.length) {
    return res.send({ success: false, message: "Too many characters for an address." });
  }

  // Zip

  if (isEmpty(payload.zip)) {
    return res.send({ success: false, message: "Zip code is required." });
  }

  if (payload.zip.length > membersConfigs.zip.length) {
    return res.send({ success: false, message: "Too many characters for ZIP Code." });
  }

  // TIN

  if (isEmpty(payload.tin)) {
    return res.send({ success: false, message: "TIN is required." });
  }

  if (payload.tin.length < membersConfigs.tin.min || payload.tin.length > membersConfigs.tin.max) {
    return res.send({ success: false, message: "TIN number must consists 12 digits." });
  }

  // Mobile

  if (isEmpty(payload.mobile)) {
    return res.send({
      success: false,
      message: "11-digit (PH standard format, ex. 09xxxxxxxxx) mobile number is required."
    });
  }

  if (
    payload.mobile.length < membersConfigs.mobile.min ||
    payload.mobile.length > membersConfigs.mobile.max
  ) {
    return res.send({
      success: false,
      message: "Mobile number must consists 11-digit (PH standard format, ex. 09xxxxxxxxx)."
    });
  }

  // Telephone

  if (isEmpty(payload.telephone)) {
    return res.send({ success: false, message: "Telephone number is required." });
  }

  if (
    payload.telephone.length < membersConfigs.telephone.min ||
    payload.telephone.length > membersConfigs.telephone.max
  ) {
    return res.send({
      success: false,
      message: "Invalid telephone number. You may include area code Ex. (02)xxxxxx..."
    });
  }

  // Payor Type

  if (isEmpty(payload.payorType)) {
    return res.send({ success: false, message: "Please select a payor type." });
  }

  if (!membersConfigs.payorType.allowedValues.includes(payload.payorType)) {
    return res.send({ success: false, message: "Unacceptable payor type." });
  }

  if (payload.payorType.length > membersConfigs.payorType.length) {
    return res.send({ success: false, message: "Invalid payor type." });
  }

  // Email

  if (isEmpty(payload.email)) {
    return res.send({ success: false, message: "Email is required." });
  }

  if (!validator.isEmail(payload.email)) {
    return res.send({ success: false, message: "Please provide a valid email." });
  }

  let isEmailUsed;

  try {
    isEmailUsed = await isEmailRegistered(payload.email);
  } catch (error) {
    console.error(error);
    return res.send({ success: false, message: error.message });
  }

  if (isEmailUsed) {
    return res.send({ success: false, message: "Email is already registered. Try signing in." });
  }

  if (payload.email.length > membersConfigs.email.length) {
    return res.send({ success: false, message: "Too many characters for an email address." });
  }

  // Password

  if (isEmpty(payload.password)) {
    return res.send({ success: false, message: "Password is required." });
  }

  if (payload.password.length > membersConfigs.password.max) {
    return res.send({ success: false, message: "Too many password characters." });
  }

  if (payload.password.length < membersConfigs.password.min) {
    return res.send({ success: false, message: "Weak password." });
  }

  next();
}

export async function validateIndividualRegistrationPayload(req, res, next) {
  const payload = req.body;

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

export async function validateEmployerRegistrationPayload(req, res, next) {
  const payload = req.body;

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

export async function validateLoginPayload(req, res, next) {
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

  let isEmailUsed;

  try {
    isEmailUsed = await isEmailRegistered(payload.email);
  } catch (error) {
    return res.send({
      success: false,
      message: error.message
    });
  }

  if (!isEmailUsed) {
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
