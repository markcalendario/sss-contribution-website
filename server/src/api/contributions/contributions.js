import express from "express";
import {
  isEmployerMember,
  isIndividualMember,
  validateAuthCookie
} from "../../global/middlewares/authorizations.js";
import {
  handleEmployerContributionFiling,
  handleIndividualContributionFiling,
  handleRemoveUnpaidContribution
} from "./contributions.handlers.js";
import {
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

export default router;
