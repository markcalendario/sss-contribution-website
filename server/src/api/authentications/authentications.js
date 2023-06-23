import express from "express";

import {
  handleIndividualMemberRegistration,
  handleEmployerRegistration,
  handleLogin
} from "./authentications.handlers.js";

import {
  validateIndividualRegistrationPayloads,
  validateEmployerRegistrationPayloads,
  validateLoginPayloads,
  validateMemberRegistrationPayloads
} from "./authentications.middlewares.js";

const router = express.Router();

router.post(
  "/register/individual",
  validateMemberRegistrationPayloads,
  validateIndividualRegistrationPayloads,
  handleIndividualMemberRegistration
);
router.post(
  "/register/employer",
  validateMemberRegistrationPayloads,
  validateEmployerRegistrationPayloads,
  handleEmployerRegistration
);
router.get("/login", validateLoginPayloads, handleLogin);

export default router;
