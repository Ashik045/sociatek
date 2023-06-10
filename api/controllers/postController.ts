// external imports
import { Request, Response } from "express";

// internal imports
import { Post } from "../models/postmodel";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

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
        const post = await Post.findByIdAndUpdate(
          req.params.postid,
          {
            $set: req.body,
          },
          { new: true }
        );

        res.status(200).json({
          message: post,
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

// like a post
const likePost = async (req: AuthenticatedRequest & Request, res: Response) => {
  try {
    const { postid } = req.params;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized!" });
    }

    const loggedInUserId = req.user.id;

    try {
      // Find the post to be liked by the user
      const postToLike = await Post.findById(postid);

      if (!postToLike) {
        return res.status(404).json({ error: "Post not found!" });
      }

      // Add the user ID to the likes list of the of the post to be liked
      postToLike?.likes.push(loggedInUserId);

      await postToLike?.save();

      res.status(200).json({ message: "Liked the post." });
    } catch (error) {
      res.status(500).json({
        error: "Failed to like the post!",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Failed to like the post!",
    });
  }
};

// unlike a post
const unLikePost = async (
  req: AuthenticatedRequest & Request,
  res: Response
) => {
  try {
    const { postid } = req.params;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized!" });
    }

    const loggedInUserId = req.user.id;

    try {
      // Find the post to be unliked by the user
      const postToUnlike = await Post.findById(postid);

      if (!postToUnlike) {
        return res.status(404).json({ error: "Post not found!" });
      }

      // Remove the user ID from the likes array of the post
      const index = postToUnlike.likes.indexOf(loggedInUserId);
      if (index !== -1) {
        postToUnlike.likes.splice(index, 1);
      }

      await postToUnlike.save();

      res.status(200).json({ message: "Unliked the post." });
    } catch (error) {
      res.status(500).json({
        error: "Failed to unlike the post!",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Failed to unlike the post!",
    });
  }
};

export {
  CreatePost,
  getPostById,
  getAllPosts,
  updPost,
  deletePost,
  likePost,
  unLikePost,
};
