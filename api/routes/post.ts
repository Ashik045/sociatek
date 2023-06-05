import express from "express";

// internal imports
import {
  CreatePost,
  deletePost,
  getAllPosts,
  getPostById,
  updPost,
} from "../controllers/postController";
import {
  PostAuthValidator,
  PostValidatioin,
  PostValidatioinHandler,
} from "../middlewares/postValidator";

const router = express.Router();

// create a post
router.post(
  "/post/create",
  PostAuthValidator,
  PostValidatioin,
  PostValidatioinHandler,
  CreatePost
);

// get post by postid
router.get("/post/:postid", getPostById);

// get all posts
router.get("/posts/all", getAllPosts);

// update post
router.put(
  "/post/:postid",
  PostAuthValidator,
  PostValidatioin,
  PostValidatioinHandler,
  updPost
);

// delete post
router.delete("/post/:postid", deletePost);

export default router;
