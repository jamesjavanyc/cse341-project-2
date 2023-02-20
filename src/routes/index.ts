const router = require("express").Router();

router.use("/login",require("./authentication"))

module.exports = router

export {}