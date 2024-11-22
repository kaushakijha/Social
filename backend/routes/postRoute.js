import express from "express";
import { createPost, getAllPosts, getMyPosts } from "../controllers/postController.js";
import { isAuthenticated } from "../middleware/auth.js";

const postRouter = express.Router();

postRouter.post("/create",isAuthenticated ,createPost);

postRouter.get("/create",isAuthenticated,createPost)
postRouter.get("/create",isAuthenticated,getAllPosts)
postRouter.get("/create",isAuthenticated,getMyPosts)

export default postRouter;