const authController = require("../controller/authentication")
const router = require("express").Router();

router.use("/github-login",authController.oauthLogin)

router.use("/oauth-callback",authController.oauthCallback)

module.exports = router

export {}