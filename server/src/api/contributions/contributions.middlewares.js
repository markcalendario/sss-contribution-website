import moment from "moment";
import validator from "validator";
import contributionsConfigs from "../../db/configs/contributions.configs.js";
import paymentsConfigs from "../../db/configs/payments.configs.js";
import { decodeAuthToken } from "../../global/utils/jwt.js";
import {
  isArray,
  isString,
  isStringEmpty
} from "../../global/utils/validators.js";
import {
  hasUnpaidContributions,
  isContributionAmountValid,
  isPeriodAlreadyPaid,
  isPeriodRetroactive
} from "./contributions.utils.js";

export async function validateCommonContributionPayload(req, res, next) {
  const sssNo = decodeAuthToken(req.cookies.auth_token).sss_no;

  try {
    const [isHasUnpaid, unpaidContributionsCount] =
      await hasUnpaidContributions(sssNo);

    if (isHasUnpaid > 0) {
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
    return res.send({
      success: false,
      message: "Contributions must be a type of list."
    });
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
      return res.send({
        success: false,
        message: "Invalid year: " + year
      });
    }

    if (!validator.isInt(year)) {
      return res.send({
        success: false,
        message: "Year must be a number."
      });
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

    const isMonthValid =
      contributionsConfigs.month.allowedValues.includes(month);

    if (!isMonthValid) {
      return res.send({
        success: false,
        message: "Invalid month: " + month
      });
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
    let [isAmountValid, text] = isContributionAmountValid(
      contribution.sss,
      "sss"
    );

    if (!isAmountValid) {
      return res.send({
        success: false,
        message: text
      });
    }
  }

  next();
}

export async function validateECContributionAmountPayload(req, res, next) {
  const contributions = req.body.contributions;

  for (const contribution of contributions) {
    let [isAmountValid, text] = isContributionAmountValid(
      contribution.ec,
      "ec"
    );

    if (!isAmountValid) {
      return res.send({
        success: false,
        message: text
      });
    }
  }

  next();
}

export function validatePaymentPayload(req, res, next) {
  const { amount, mode, bank, checkReference, checkDate } = req.body;

  // Mode validation

  if (!isString(mode)) {
    return res.send({
      success: false,
      message: "Payment mode must be string."
    });
  }

  if (isStringEmpty(mode)) {
    return res.send({
      success: false,
      message: "Payment mode is required."
    });
  }

  if (!paymentsConfigs.mode.allowedValues.includes(mode)) {
    return res.send({
      success: false,
      message: "Invalid payment mode."
    });
  }

  // Amount validation

  if (!isString(amount)) {
    return res.send({
      success: false,
      message: "Amount must be string."
    });
  }

  if (isStringEmpty(amount)) {
    return res.send({
      success: false,
      message: "Amount is required."
    });
  }

  if (!validator.isNumeric(amount)) {
    return res.send({
      success: false,
      message: "Please type valid amount."
    });
  }

  // End on Cash

  if (mode === "cash") {
    req.body.bank = null;
    req.body.checkReference = null;
    req.body.checkDate = null;
    return next();
  }

  // For bank mode
  // Bank name validation

  if (!isString(bank)) {
    return res.send({
      success: false,
      message: "Bank name must be string."
    });
  }

  if (isStringEmpty(bank)) {
    return res.send({
      success: false,
      message: "Bank name is required."
    });
  }

  if (bank.length > paymentsConfigs.bank.maxLength) {
    return res.send({
      success: false,
      message: "Bank name has too many characters."
    });
  }

  // End on Bank

  if (mode === "bank") {
    req.body.checkReference = null;
    req.body.checkDate = null;
    return next();
  }

  // For check mode

  // Cheque reference validation

  if (!isString(checkReference)) {
    return res.send({
      success: false,
      message: "Check reference must be a string."
    });
  }

  if (isStringEmpty(checkReference)) {
    return res.send({
      success: false,
      message: "Check reference code is required."
    });
  }

  if (checkReference.length > paymentsConfigs.check_reference.maxLength) {
    return res.send({
      success: false,
      message: "Check reference has too many characters."
    });
  }

  // Cheque date validation

  if (!isString(checkDate)) {
    return res.send({
      success: false,
      message: "Check date must be string."
    });
  }

  if (isStringEmpty(checkDate)) {
    return res.send({
      success: false,
      message: "Check date is required."
    });
  }

  if (!validator.isDate(checkDate)) {
    return res.send({
      success: false,
      message:
        "Date format is not valid. The required date format is YYYY-MM-DD."
    });
  }

  // Check if cheque is expired

  const isExpired = moment(checkDate, "YYYY-MM-DD").isBefore(
    moment().add(3, "M")
  );
  if (isExpired) {
    return res.send({
      success: false,
      message: `Invalid check. The validity date must be atleast 3 months from now.`
    });
  }

  next();
}
