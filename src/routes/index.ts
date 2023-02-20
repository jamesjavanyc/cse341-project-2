import {Router} from "express";

const router = Router();

router.use("/auth",require("./authentication"))


module.exports = router
