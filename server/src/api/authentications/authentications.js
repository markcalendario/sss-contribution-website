import express from "express";

import {
  handleIndividualMemberRegistration,
  handleEmployerRegistration,
  handleLogin
} from "./authentications.handlers.js";

import {
  validateIndividualRegistrationPayloads,
  validateEmployerRegistrationPayloads,
  validateLoginPayloads
} from "./authentications.middlewares.js";

const router = express.Router();

router.post(
  "/register/individual",
  validateIndividualRegistrationPayloads,
  handleIndividualMemberRegistration
);
router.post("/register/employer", validateEmployerRegistrationPayloads, handleEmployerRegistration);
router.get("/login", validateLoginPayloads, handleLogin);

export default router;
