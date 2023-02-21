import {Router} from "express";

const postController = require("../controller/post")

const router = Router();

router.get("/public",postController.getAllPublicPosts)

router.get("/",postController.getAllPosts)

router.post("/",postController.createPosts)

router.put("/",postController.updatePosts)

router.delete("/",postController.deletePosts)


module.exports = router