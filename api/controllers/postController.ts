// external imports
import { Request, Response } from "express";

// internal imports
import { Post } from "../models/postmodel";
import { User } from "../models/usermodel";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
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

// get all posts
const getAllPosts = async (req: Request, res: Response) => {
  const { user, limit, lastPostId } = req.query;
  try {
    const query: any = user ? { username: user } : {};

    if (lastPostId) {
      query._id = { $lt: lastPostId };
    }

    const options: any = {};

    if (limit) {
      options.limit = parseInt(limit.toString());
    }

    const posts = await Post.find(query, null, options).sort({ createdAt: -1 });

    res.status(200).json({
      message: posts,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error retrieving posts",
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
const deletePost = async (
  req: AuthenticatedRequest & Request,
  res: Response
) => {
  try {
    const post = await Post.findById(req.params.postid);

    // check only the user created the post can update it
    if (post?.username === req.user?.username) {
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

      const reactedUser = await User.findById(loggedInUserId);
      if (!reactedUser) {
        return res.status(404).json({ error: "User not found!" });
      }

      // Add the user ID to the likes list of the of the post to be liked
      postToLike?.likes.push(loggedInUserId);

      // add the postid to the activities array of a user
      reactedUser?.activities.push(postToLike._id.toString());

      await postToLike?.save();
      await reactedUser?.save();

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

      const reactedUser = await User.findById(loggedInUserId);
      if (!reactedUser) {
        return res.status(404).json({ error: "User not found!" });
      }

      // Remove the user ID from the likes array of the post
      const index = postToUnlike.likes.indexOf(loggedInUserId);
      if (index !== -1) {
        postToUnlike.likes.splice(index, 1);
      }

      // Remove the post ID from the activities array of the user
      const index2 = reactedUser?.activities.indexOf(
        postToUnlike._id.toString()
      );
      if (index2 !== -1) {
        reactedUser?.activities.splice(index2, 1);
      }

      await postToUnlike.save();
      await reactedUser.save();

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

// fetch the reacted users list of a perticular post
const getReactedUsersList = async (req: Request, res: Response) => {
  const { postid } = req.params;

  try {
    const post = await Post.findById(postid);
    if (!post) {
      return res.status(404).json({ error: "Post not found!" });
    }

    const reactedUsersList = await User.find({ _id: { $in: post.likes } });
    res.status(200).json({
      message: reactedUsersList,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reactedusers!" });
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
  getReactedUsersList,
};
