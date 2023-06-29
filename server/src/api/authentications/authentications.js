import express from "express";

import {
  handleIndividualMemberRegistration,
  handleEmployerRegistration,
  handleLogin,
  handleIsAuth,
  handleLogout
} from "./authentications.handlers.js";

import {
  validateIndividualRegistrationPayload,
  validateEmployerRegistrationPayload,
  validateLoginPayload,
  validateMemberRegistrationPayload
} from "./authentications.middlewares.js";
import { validateAuthCookie } from "../../global/middlewares/authorizations.js";

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
