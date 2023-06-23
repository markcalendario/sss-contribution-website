import { isEmpty } from "../../global/utils/validators.js";
import contributionsConfigs from "../../db/contributions.configs.js";
import { isPeriodAlreadyPaid, isPeriodRetroactive } from "./contributions.utils.js";
import { decodeAuthToken } from "../../global/utils/jwt.js";

export async function validateIndividualContributionFilingPayload(req, res, next) {
  const contributionPayload = req.body.contributions;
  const sssNo = decodeAuthToken(req.cookies.auth_token).sss_no;

  if (isEmpty(contributionPayload)) {
    return res.send({ success: false, message: "We cannot find contribution request data." });
  }

  for (const contribution of contributionPayload) {
    if (isEmpty(contribution.month)) {
      return res.send({ success: false, message: "Month is required." });
    }

    if (!contributionsConfigs.month.allowedValues.includes(contribution.month)) {
      return res.send({ success: false, message: "Invalid month: " + contribution.month });
    }

    if (isEmpty(contribution.year)) {
      return res.send({ success: false, message: "Year is required." });
    }

    if (contribution.year.toString().length > contributionsConfigs.year.length) {
      return res.send({ success: false, message: "Invalid year: " + contribution.year });
    }

    if (isNaN(parseFloat(contribution.amount))) {
      return res.send({ success: false, message: "Amount is not a number." });
    }

    if (parseFloat(contribution.amount) > contributionsConfigs.amount.max) {
      return res.send({
        success: false,
        message: "The maximum acceptable amount is " + contributionsConfigs.amount.max
      });
    }

    if (parseFloat(contribution.amount) < contributionsConfigs.amount.min) {
      return res.send({
        success: false,
        message: "The minimum acceptable amount is " + contributionsConfigs.amount.min
      });
    }

    if (isPeriodRetroactive(contribution.month, contribution.year)) {
      return res.send({
        success: false,
        message: "You cannot pay retroactively."
      });
    }

    if (await isPeriodAlreadyPaid(contribution.month, contribution.year, sssNo)) {
      return res.send({
        success: false,
        message: `Period ${contribution.month} ${contribution.year} is already paid.`
      });
    }
  }

  next();
}
