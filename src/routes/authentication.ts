import {Router} from "express";

const authController = require("../controller/authentication")

const router = Router();

router.use("/github-login",authController.oauthLogin)

router.use("/oauth-callback",authController.oauthCallback)

router.post("/email-login",authController.emailLogin)

router.post("/register", authController.register)

module.exports = router
