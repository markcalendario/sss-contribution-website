import express from "express";

import {
  handleIndividualMemberRegistration,
  handleEmployerRegistration,
  handleLogin
} from "./authentications.handlers.js";

import {
  validateIndividualRegistrationPayload,
  validateEmployerRegistrationPayload,
  validateLoginPayload,
  validateMemberRegistrationPayload
} from "./authentications.middlewares.js";

const router = express.Router();

router.post(
  "/register/individual",
  validateMemberRegistrationPayload,
  validateIndividualRegistrationPayload,
  handleIndividualMemberRegistration
);
router.post(
  "/register/employer",
  validateMemberRegistrationPayload,
  validateEmployerRegistrationPayload,
  handleEmployerRegistration
);
router.get("/login", validateLoginPayload, handleLogin);

export default router;
