import express from "express";
import {
  isEmployerMember,
  isIndividualMember,
  validateAuthCookie
} from "../../global/middlewares/authorizations.js";
import {
  handleEmployerContributionFiling,
  handleGetAvailablePeriods,
  handleGetUnpaidContributions,
  handleGetUnpaidContributionsAmount,
  handleHistory,
  handleIndividualContributionFiling,
  handlePayContribution,
  handleRemoveUnpaidContribution
} from "./contributions.handlers.js";
import {
  validatePaymentPayload,
  validateCommonContributionPayload,
  validateECContributionAmountPayload,
  validateSSSContributionAmountPayload
} from "./contributions.middlewares.js";
const router = express.Router();

router.post(
  "/individual/file-contribution",
  validateAuthCookie,
  isIndividualMember,
  validateCommonContributionPayload,
  validateSSSContributionAmountPayload,
  handleIndividualContributionFiling
);

router.post(
  "/employer/file-contribution",
  validateAuthCookie,
  isEmployerMember,
  validateCommonContributionPayload,
  validateSSSContributionAmountPayload,
  validateECContributionAmountPayload,
  handleEmployerContributionFiling
);
router.delete("/remove-unpaid-contribution", validateAuthCookie, handleRemoveUnpaidContribution);
router.post("/pay", validateAuthCookie, validatePaymentPayload, handlePayContribution);
router.get("/history", validateAuthCookie, handleHistory);
router.get("/available-periods", validateAuthCookie, handleGetAvailablePeriods);
router.get("/unpaid", validateAuthCookie, handleGetUnpaidContributions);
router.get("/unpaid-amount", validateAuthCookie, handleGetUnpaidContributionsAmount);
export default router;
