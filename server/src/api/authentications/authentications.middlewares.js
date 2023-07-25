import validator from "validator";
import employersConfigs from "../../db/configs/employers.configs.js";
import individualConfigs from "../../db/configs/individual.configs.js";
import membersConfigs from "../../db/configs/members.configs.js";

import { isString, isStringEmpty } from "../../global/utils/validators.js";
import { isEmailRegistered } from "./authentications.utils.js";

export async function validateMemberRegistrationPayload(req, res, next) {
  const { address, zip, tin, mobile, telephone, payorType, email, password } = req.body;

  // Address

  if (!isString(address)) {
    return res.send({ success: false, message: "Address must be string." });
  }

  if (isStringEmpty(address)) {
    return res.send({ success: false, message: "Complete address is required." });
  }

  if (address.length > membersConfigs.address.maxLength) {
    return res.send({ success: false, message: "Too many characters for an address." });
  }

  if (address.length < membersConfigs.address.minLength) {
    return res.send({ success: false, message: "Too few characters for an address." });
  }

  // Zip

  if (!isString(zip)) {
    return res.send({ success: false, message: "Zip code must be string." });
  }

  if (isStringEmpty(zip)) {
    return res.send({ success: false, message: "Zip code is required." });
  }

  if (zip.length > membersConfigs.zip.maxLength || zip.length < membersConfigs.zip.minLength) {
    return res.send({
      success: false,
      message: `ZIP Code must contain ${membersConfigs.zip.maxLength} digits.`
    });
  }

  if (!validator.isInt(zip)) {
    return res.send({
      success: false,
      message: "ZIP code is invalid. It must contain numbers only."
    });
  }

  // Mobile

  if (!isString(mobile)) {
    return res.send({ success: false, message: "Mobile number must be string." });
  }

  if (isStringEmpty(mobile)) {
    return res.send({
      success: false,
      message: "11-digit mobile number is required."
    });
  }

  if (
    mobile.length < membersConfigs.mobile.minLength ||
    mobile.length > membersConfigs.mobile.maxLength
  ) {
    return res.send({
      success: false,
      message: "Mobile number must consists 11-digit."
    });
  }

  if (!validator.isInt(mobile)) {
    return res.send({
      success: false,
      message: "Invalid mobile number. Use the Philippine standard format, ex. 09xxxxxxxxx."
    });
  }

  // Telephone

  if (!isString(telephone)) {
    return res.send({ success: false, message: "Telephone number must be string." });
  }

  if (
    !isStringEmpty(telephone) &&
    (telephone.length < membersConfigs.telephone.minLength ||
      telephone.length > membersConfigs.telephone.maxLength)
  ) {
    return res.send({
      success: false,
      message: `Telephone number must consist minimum length of ${membersConfigs.telephone.minLength} and maximum length of ${membersConfigs.telephone.maxLength}`
    });
  }

  if (!isStringEmpty(telephone) && !validator.isInt(telephone)) {
    return res.send({
      success: false,
      message: "Invalid telephone number. You may include area code Ex. 02xxxxxx.."
    });
  }

  // Email

  if (!isString(email)) {
    return res.send({ success: false, message: "Email must be string." });
  }

  if (isStringEmpty(email)) {
    return res.send({ success: false, message: "Email is required." });
  }

  if (!validator.isEmail(email)) {
    return res.send({ success: false, message: "Please provide a valid email." });
  }

  if (email.length > membersConfigs.email.maxLength) {
    return res.send({ success: false, message: "Too many characters for an email address." });
  }

  if (email.length < membersConfigs.email.minLength) {
    return res.send({ success: false, message: "Too few characters for an email address." });
  }

  let isEmailUsed;

  try {
    isEmailUsed = await isEmailRegistered(email);
  } catch (error) {
    console.error(error);
    return res.send({ success: false, message: error.message });
  }

  if (isEmailUsed) {
    return res.send({ success: false, message: "Email is already registered. Try signing in." });
  }

  // TIN: optional

  if (!isString(tin)) {
    return res.send({ success: false, message: "TIN must be string." });
  }

  if (
    !isStringEmpty(tin) &&
    (tin.length < membersConfigs.tin.minLength || tin.length > membersConfigs.tin.maxLength)
  ) {
    return res.send({ success: false, message: "TIN must consist 12 digits." });
  }

  if (!isStringEmpty(tin) && !validator.isInt(tin)) {
    return res.send({
      success: false,
      message: "TIN must contain numbers only."
    });
  }

  // Payor Type

  if (!isString(payorType)) {
    return res.send({ success: false, message: "Payor type must be string." });
  }

  if (isStringEmpty(payorType)) {
    return res.send({ success: false, message: "Please select a payor type." });
  }

  if (!membersConfigs.payorType.allowedValues.includes(payorType)) {
    return res.send({ success: false, message: `Payor type ${payorType} is not valid.` });
  }

  // Password

  if (!isString(password)) {
    return res.send({ success: false, message: "Password must be string." });
  }

  if (isStringEmpty(password)) {
    return res.send({ success: false, message: "Password is required." });
  }

  const isPasswordLengthInRange =
    password.length <= membersConfigs.password.maxLength &&
    password.length >= membersConfigs.password.minLength;

  if (!isPasswordLengthInRange) {
    return res.send({
      success: false,
      message: `Password must consist ${membersConfigs.password.minLength} to ${membersConfigs.password.maxLength} chatacers.`
    });
  }

  next();
}

export async function validateIndividualRegistrationPayload(req, res, next) {
  const { crn, firstName, middleName, lastName, suffix } = req.body;

  // Individual payload validation

  // First Name

  if (!isString(firstName)) {
    return res.send({ success: false, message: "First name must be string." });
  }

  if (isStringEmpty(firstName)) {
    return res.send({ success: false, message: "First name is required." });
  }

  if (firstName.length > individualConfigs.first_name.maxLength) {
    return res.send({ success: false, message: "Too many characters for a first name." });
  }

  // Middle Name

  if (!isString(middleName)) {
    return res.send({ success: false, message: "Middle name must be string." });
  }

  if (isStringEmpty(middleName)) {
    return res.send({ success: false, message: "Middle name is required." });
  }

  if (middleName.length > individualConfigs.middle_name.maxLength) {
    return res.send({ success: false, message: "Too many characters for a middle name." });
  }

  // Last Name

  if (!isString(lastName)) {
    return res.send({ success: false, message: "Middle name must be string." });
  }

  if (isStringEmpty(lastName)) {
    return res.send({ success: false, message: "Last name is required." });
  }

  if (lastName.length > individualConfigs.last_name.maxLength) {
    return res.send({ success: false, message: "Too many characters for a last name." });
  }

  // Suffix : optional

  if (!isString(suffix)) {
    return res.send({ success: false, message: "Suffix must be string." });
  }

  if (!isStringEmpty(suffix) && suffix.length > individualConfigs.suffix.maxLength) {
    return res.send({ success: false, message: "Too many characters for a name suffix." });
  }

  // CRN : optional

  if (!isString(crn)) {
    return res.send({ success: false, message: "CRN must be string." });
  }

  if (
    !isStringEmpty(crn) &&
    (crn.length < individualConfigs.crn.minLength || crn.length > individualConfigs.crn.maxLength)
  ) {
    return res.send({ success: false, message: "CRN must consist 12 digits." });
  }

  if (!isStringEmpty(crn) && !validator.isInt(crn)) {
    return res.send({ success: false, message: "Invalid common reference number (CRN)." });
  }

  next();
}

export async function validateEmployerRegistrationPayload(req, res, next) {
  const { website, businessName } = req.body;

  // Employer member data payload validation

  // Website : optional

  if (!isString(website)) {
    return res.send({
      success: false,
      message: "Website link must be string."
    });
  }

  if (!isStringEmpty(website) && !validator.isURL(website)) {
    return res.send({
      success: false,
      message: "Invalid website link. Include http/https protocol and make sure it is a valid URL."
    });
  }

  if (website.length > employersConfigs.website.maxLength) {
    return res.send({
      success: false,
      message: "Too many characters for website link."
    });
  }

  // Business Name

  if (isStringEmpty(businessName)) {
    return res.send({ success: false, message: "Business name is required." });
  }

  if (businessName.length > employersConfigs.business_name.maxLength) {
    return res.send({ success: false, message: "Too many characters for a business name." });
  }

  next();
}

export async function validateLoginPayload(req, res, next) {
  const { email, password } = req.body;

  // Email

  if (!isString(email)) {
    return res.send({ success: false, message: "Email address must be a string." });
  }

  if (isStringEmpty(email)) {
    return res.send({ success: false, message: "Email address is required." });
  }

  if (!validator.isEmail(email)) {
    return res.send({
      success: false,
      message: "The email address you provided is not a valid email address."
    });
  }

  let isEmailUsed;

  try {
    isEmailUsed = await isEmailRegistered(email);
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

  // Password

  if (!isString(password)) {
    return res.send({ success: false, message: "Email address must be a string." });
  }

  if (isStringEmpty(password)) {
    return res.send({ success: false, message: "Password is required." });
  }

  next();
}
