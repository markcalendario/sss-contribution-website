import { isEmpty } from "../../global/utils/validators.js";
import contributionsConfigs from "../../db/configs/contributions.configs.js";
import {
  hasUnpaidContributions,
  isPeriodAlreadyPaid,
  isPeriodRetroactive
} from "./contributions.utils.js";
import { decodeAuthToken } from "../../global/utils/jwt.js";
import validator from "validator";

export async function validateCommonContributionPayload(req, res, next) {
  const contributions = req.body.contributions;
  if (isEmpty(contributions)) {
    return res.send({ success: false, message: "We cannot find contribution request data." });
  }

  let unpaidContributionsCount;

  try {
    const sssNo = decodeAuthToken(req.cookies.auth_token).sss_no;
    unpaidContributionsCount = await hasUnpaidContributions(sssNo);
  } catch (error) {
    console.error(error);
    return res.send({
      success: false,
      message: "An error occured while checking pending payments."
    });
  }

  if (unpaidContributionsCount > 0) {
    return res.send({
      success: false,
      message: `You still have unpaid contributions for ${unpaidContributionsCount} periods.`
    });
  }

  for (const contribution of contributions) {
    if (isEmpty(contribution.month) || isEmpty(contribution.year)) {
      return res.send({
        success: false,
        message: "Some of the contributions payload are invalid."
      });
    }

    const isMonthValid = contributionsConfigs.month.allowedValues.includes(contribution.month);
    if (!isMonthValid) {
      return res.send({ success: false, message: "Invalid month: " + contribution.month });
    }

    const isYearValid = contribution.year.toString().length > contributionsConfigs.year.length;
    if (isYearValid) {
      return res.send({ success: false, message: "Invalid year: " + contribution.year });
    }

    if (isPeriodRetroactive(contribution.month, contribution.year)) {
      return res.send({
        success: false,
        message: "You cannot pay retroactively."
      });
    }
  }

  next();
}

export async function validateSSSContributionAmountPayload(req, res, next) {
  const contributions = req.body.contributions;

  for (const contribution of contributions) {
    const sssAmount = contribution.sss;

    if (isEmpty(sssAmount)) {
      return res.send({
        success: false,
        message: "SSS contribution amount is required."
      });
    }

    const isValidCurrency = validator.isNumeric(sssAmount.toString());
    if (!isValidCurrency) {
      return res.send({ success: false, message: "SSS contribution amount is not a number." });
    }

    const isAmountOverMaxRange = parseFloat(sssAmount) > contributionsConfigs.sss.max;
    if (isAmountOverMaxRange) {
      return res.send({
        success: false,
        message: "The maximum acceptable SSS contribution amount is " + contributionsConfigs.sss.max
      });
    }

    const isAmountUnderMinRange = parseFloat(sssAmount) < contributionsConfigs.sss.min;
    if (isAmountUnderMinRange) {
      return res.send({
        success: false,
        message: "The minimum acceptable SSS contribution amount is " + contributionsConfigs.sss.min
      });
    }

    let isPeriodPaid;

    try {
      const sssNo = decodeAuthToken(req.cookies.auth_token).sss_no;
      isPeriodPaid = await isPeriodAlreadyPaid(contribution.month, contribution.year, sssNo);
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        success: false,
        message: "An error occured while checking period state."
      });
    }

    if (isPeriodPaid) {
      return res.send({
        success: false,
        message: "You already paid this period."
      });
    }
  }

  next();
}

export async function validateECContributionAmountPayload(req, res, next) {
  const contributions = req.body.contributions;

  for (const contribution of contributions) {
    const ecAmount = contribution.ec;

    if (isEmpty(ecAmount)) {
      return res.send({
        success: false,
        message: "EC contribution amount is required."
      });
    }

    const isValidCurrency = validator.isNumeric(ecAmount.toString());
    if (!isValidCurrency) {
      return res.send({ success: false, message: "EC contribution amount is not a number." });
    }

    const isAmountOverMaxRange = parseFloat(ecAmount) > contributionsConfigs.ec.max;
    if (isAmountOverMaxRange) {
      return res.send({
        success: false,
        message: "The maximum acceptable EC contribution amount is " + contributionsConfigs.ec.max
      });
    }

    const isAmountUnderMinRange = parseFloat(ecAmount) < contributionsConfigs.ec.min;
    if (isAmountUnderMinRange) {
      return res.send({
        success: false,
        message: "The minimum acceptable EC contribution amount is " + contributionsConfigs.ec.min
      });
    }

    let isPeriodPaid;

    try {
      const sssNo = decodeAuthToken(req.cookies.auth_token).sss_no;
      isPeriodPaid = await isPeriodAlreadyPaid(contribution.month, contribution.year, sssNo);
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        success: false,
        message: "An error occured while checking period state."
      });
    }

    if (isPeriodPaid) {
      return res.send({
        success: false,
        message: "You already paid this period."
      });
    }
  }

  next();
}
