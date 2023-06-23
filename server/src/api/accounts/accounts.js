import express from "express";
import {
  isEmployerMember,
  isIndividualMember,
  validateAuthCookie
} from "../../global/middlewares/authorization.js";
import {
  handleGetEmployerMemberInfo,
  handleGetIndividualMemberInfo,
  handleGetRole
} from "./accounts.handler.js";
const router = express.Router();

router.get("/role", validateAuthCookie, handleGetRole);

router.get(
  "/individual/info",
  validateAuthCookie,
  isIndividualMember,
  handleGetIndividualMemberInfo
);

router.get("/employer/info", validateAuthCookie, isEmployerMember, handleGetEmployerMemberInfo);

export default router;
