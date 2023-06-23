import express from "express";
import { isIndividualMember, validateAuthCookie } from "../../global/middlewares/authorizations.js";
import { handleIndividualContributionFiling } from "./contributions.handlers.js";
import { validateIndividualContributionFilingPayload } from "./contributions.middlewares.js";
const router = express.Router();

router.post(
  "/individual/file-contribution",
  validateAuthCookie,
  isIndividualMember,
  validateIndividualContributionFilingPayload,
  handleIndividualContributionFiling
);

export default router;
