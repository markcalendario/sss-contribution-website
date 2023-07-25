import express from "express";

import {
  handleEmployerRegistration,
  handleIndividualMemberRegistration,
  handleIsAuth,
  handleLogin,
  handleLogout
} from "./authentications.handlers.js";

import {
  validateEmployerRegistrationPayload,
  validateIndividualRegistrationPayload,
  validateLoginPayload,
  validateMemberRegistrationPayload
} from "./authentications.middlewares.js";

const router = express.Router();

router.post(
  "/register/individual",
  validateIndividualRegistrationPayload,
  validateMemberRegistrationPayload,
  handleIndividualMemberRegistration
);
router.post(
  "/register/employer",
  validateMemberRegistrationPayload,
  validateEmployerRegistrationPayload,
  handleEmployerRegistration
);
router.post("/login", validateLoginPayload, handleLogin);
router.delete("/logout", handleLogout);
router.get("/is-auth", handleIsAuth);

export default router;
