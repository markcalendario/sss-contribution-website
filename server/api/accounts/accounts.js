const router = require("express").Router();
const { handleMemberRegistration, handleEmployerRegistration } = require("./accounts.handlers");
const {
  validateIndividualRegistrationPayloads,
  validateEmployerRegistrationPayloads
} = require("./accounts.middlewares");

router.post("/register/member", validateIndividualRegistrationPayloads, handleMemberRegistration);
router.post("/register/employer", validateEmployerRegistrationPayloads, handleEmployerRegistration);

module.exports = router;
