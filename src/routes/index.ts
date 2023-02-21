import {Router} from "express";

const router = Router();

router.use("/auth",require("./authentication"))
router.use("/*", require("../utils/jwt").verifyRestToken)
router.use("/posts", require("./post"))


module.exports = router
