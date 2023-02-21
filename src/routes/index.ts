import {Router} from "express";

const router = Router();

router.use("/auth",require("./authentication"))
router.use("/*", require("../utils/jwt").verifyToken)
router.use("/echo", (req, res) =>{
  res.status(200).send("Hello")
})


module.exports = router
