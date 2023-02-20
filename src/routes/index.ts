import {Router} from "express";

const router = Router();

router.use("/login",require("./authentication"))

module.exports = router
