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

// get a post by id
const getPostById = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.postid);

    res.status(200).json({
      message: post,
    });
  } catch (error) {
    res.status(500).json({
      error: "Post not found!",
    });
  }
};

// get all posts from the database
const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find();

    res.status(200).json({
      message: posts,
    });
  } catch (error) {
    res.status(500).json({
      error: "Not found any post!",
    });
  }
};

// update post
const updPost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.postid);

    // check only the user created the post can update it
    if (post?.username === req.body.username) {
      try {
        await Post.findByIdAndUpdate(
          req.params.postid,
          {
            $set: req.body,
          },
          { new: true }
        );

        res.status(200).json({
          message: "Post updated successfully.",
        });
      } catch (error) {
        res.status(404).json({
          error: "Post update failed!",
        });
      }
    } else {
      res.status(404).json({
        error: "You can only update your post!",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Post update failed!",
    });
  }
};

// delete a post
const deletePost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.postid);

    // check only the user created the post can update it
    if (post?.username === req.body.username) {
      try {
        await Post.findByIdAndDelete(req.params.postid);

        res.status(200).json({
          message: "Post deleted successfully.",
        });
      } catch (error) {
        res.status(404).json({
          error: "Can't delete post!",
        });
      }
    } else {
      res.status(404).json({
        error: "You can only delete your post!",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Can't delete post!",
    });
  }
};

export { CreatePost, getPostById, getAllPosts, updPost, deletePost };
