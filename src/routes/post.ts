import {Router} from "express";

const postController = require("../controller/post")

const router = Router();

router.get("/public-posts",postController)

router.get("/posts",postController)

router.post("/posts",postController)

router.put("/posts",postController)

router.delete("/posts",postController)


module.exports = router