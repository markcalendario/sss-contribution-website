import { isStringEmpty, isString, isArray } from "../../global/utils/validators.js";
import contributionsConfigs from "../../db/configs/contributions.configs.js";
import {
  hasUnpaidContributions,
  isContributionAmountValid,
  isPeriodAlreadyPaid,
  isPeriodRetroactive
} from "./contributions.utils.js";
import { decodeAuthToken } from "../../global/utils/jwt.js";
import validator from "validator";

export async function validateCommonContributionPayload(req, res, next) {
  const sssNo = decodeAuthToken(req.cookies.auth_token).sss_no;

  try {
    const unpaidContributionsCount = await hasUnpaidContributions(sssNo);
    if (unpaidContributionsCount > 0) {
      return res.send({
        success: false,
        message: `You still have unpaid contributions for ${unpaidContributionsCount} period(s).`
      });
    }
  } catch (error) {
    console.error(error);
    return res.send({
      success: false,
      message: "An error occured while checking pending payments."
    });
  }

  const contributions = req.body.contributions;

  if (!isArray(contributions)) {
    return res.send({ success: false, message: "Contributions must be a type of list." });
  }

  for (const contribution of contributions) {
    const { month, year } = contribution;

    // Year

    if (!isString(year)) {
      return res.send({
        success: false,
        message: "Year must be a string."
      });
    }

    if (isStringEmpty(year)) {
      return res.send({
        success: false,
        message: "Year is required."
      });
    }

    const isYearValid =
      year.length > contributionsConfigs.year.maxLength ||
      year.length < contributionsConfigs.year.minLength;

    if (isYearValid) {
      return res.send({ success: false, message: "Invalid year: " + year });
    }

    if (!validator.isInt(year)) {
      return res.send({ success: false, message: "Year must be a number." });
    }

    // Month

    if (!isString(month)) {
      return res.send({
        success: false,
        message: "Month must be a string."
      });
    }

    if (isStringEmpty(month)) {
      return res.send({
        success: false,
        message: "Month is required."
      });
    }

    const isMonthValid = contributionsConfigs.month.allowedValues.includes(month);

    if (!isMonthValid) {
      return res.send({ success: false, message: "Invalid month: " + month });
    }

    if (isPeriodRetroactive(month, year)) {
      return res.send({
        success: false,
        message: "You cannot pay retroactively."
      });
    }

    let isPeriodPaid;

    try {
      isPeriodPaid = await isPeriodAlreadyPaid(month, year, sssNo);
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

export async function validateSSSContributionAmountPayload(req, res, next) {
  const contributions = req.body.contributions;

  for (const contribution of contributions) {
    let [isAmountValid, text] = isContributionAmountValid(contribution.sss, "sss");

    if (!isAmountValid) {
      return res.send({ success: false, message: text });
    }
  }

  next();
}

export async function validateECContributionAmountPayload(req, res, next) {
  const contributions = req.body.contributions;

  for (const contribution of contributions) {
    let [isAmountValid, text] = isContributionAmountValid(contribution.ec, "ec");

    if (!isAmountValid) {
      return res.send({ success: false, message: text });
    }
  }

  next();
}
