import express from "express";
import { validateAuthCookie } from "../../global/middlewares/authorization.js";
import { handleGetRole } from "./accounts.handler.js";
const router = express.Router();

router.get("/role", validateAuthCookie, handleGetRole);

export default router;
