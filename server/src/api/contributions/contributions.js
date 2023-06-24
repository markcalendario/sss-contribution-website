import express from "express";
import {
  isEmployerMember,
  isIndividualMember,
  validateAuthCookie
} from "../../global/middlewares/authorizations.js";
import {
  handleEmployerContributionFiling,
  handleIndividualContributionFiling
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

export default router;
