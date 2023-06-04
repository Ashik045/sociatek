// external imports
import { Request, Response } from "express";

// internal imports
import { Post } from "../models/postmodel";

// create a post
const CreatePost = async (req: Request, res: Response) => {
  try {
    const newPost = await new Post({ ...req.body });

    newPost.save();

    res.status(200).json({
      message: newPost,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error creating post!",
    });
  }
};

export { CreatePost };
