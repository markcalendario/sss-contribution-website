const router = require("express").Router();
const { handleMemberRegistration } = require("./accounts.handlers");
const { validateMemberRegistrationPayloads } = require("./accounts.middlewares");

router.post("/register/member", validateMemberRegistrationPayloads, handleMemberRegistration);

module.exports = router;
