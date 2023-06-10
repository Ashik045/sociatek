import express from "express";

// internal imports
import {
  CreatePost,
  deletePost,
  getAllPosts,
  getPostById,
  likePost,
  unLikePost,
  updPost,
} from "../controllers/postController";
import {
  LikePostMiddleware,
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

// like a post
router.post("/post/like/:postid", LikePostMiddleware, likePost);

// unlike a post
router.post("/post/unlike/:postid", LikePostMiddleware, unLikePost); // same middleware for unlike controller

export default router;
