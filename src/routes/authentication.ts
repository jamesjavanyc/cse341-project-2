import {Router} from "express";

const authController = require("../controller/authentication")

const router = Router();

router.use("/github-login",authController.oauthLogin)

router.use("/oauth-callback",authController.oauthCallback)

module.exports = router
