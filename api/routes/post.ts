import express from "express";

// internal imports
import { CreatePost } from "../controllers/postController";
import {
  PostAuthValidator,
  PostValidatioin,
} from "../middlewares/postValidator";

const router = express.Router();

router.post(
  "/post/create",
  PostAuthValidator,
  PostValidatioin,
  PostAuthValidator,
  CreatePost
);

export default router;
