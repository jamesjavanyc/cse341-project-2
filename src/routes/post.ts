import {Router} from "express";

const postController = require("../controller/post")

const router = Router();

router.get("/public",postController)

router.get("/",postController)

router.post("/",postController)

router.put("/",postController)

router.delete("/",postController)


module.exports = router