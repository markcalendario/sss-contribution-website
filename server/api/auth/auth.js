const router = require("express").Router();
const { handleAuth } = require("./auth.handlers");

router.get("/", handleAuth);

module.exports = router;
