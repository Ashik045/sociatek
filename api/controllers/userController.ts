// external import
import bcrypt from "bcrypt";
import express from "express";

// internal import
import { Post } from "../models/postmodel";
import { User } from "../models/usermodel";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

/**
  The getAllUsers function is an asynchronous function that retrieves a list of users based on optional query parameters such as limit and lastPostId.
 */
export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { limit, lastPostId } = req.query;
    let users;

    const query: any = {};

    if (lastPostId) {
      // If lastPostId parameter is provided, fetch data after the specified user
      query._id = { $lt: lastPostId };
    }

    const options: any = {};

    if (limit) {
      // If limit parameter is provided, fetch limited data
      options.limit = parseInt(limit.toString());
    }

    users = await User.find(query, null, options).sort({ createdAt: -1 });

    res.status(200).json({
      message: users,
    });
  } catch (error) {
    res.status(500).json({
      error: "Can not find any user!",
    });
  }
};

/**
 * The function `getUserById` retrieves a user by their user ID and returns their information, excluding their password, if found.
 * @returns a JSON response with the user information if the user is found. If the user is not found, it returns a JSON response with an error message. If there is an error during the process, it
 * returns a JSON response with an error message.
 */
export const getUserById = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const user = await User.findById(req.params.userid);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const { password: _pw, ...userInfo } = user.toObject();

    res.status(200).json({
      message: userInfo,
    });
  } catch (error) {
    res.status(500).json({
      error: "Can not find user!",
    });
  }
};

/**
 * The function `getUserByUserName` is an asynchronous function that retrieves a user by their username
 */
export const getUserByUserName = async (
  req: express.Request,
  res: express.Response
) => {
  const username = req.params.username;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }
    const { password: _pw, ...userInfo } = user.toObject();

    res.status(200).json({
      message: userInfo,
    });
  } catch (error) {
    res.status(500).json({
      error: "Can not find user!",
    });
  }
};

/**
 * The updateUser function updates a user's information in a database, including their username and password, and returns the updated user object.
 */
export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  // const username = req.body.username;
  // const isUser = await User.findOne({ username: username });
  const username = await req.params.username;
  const existingUser = await User.findOne({ username });

  try {
    // Check if the user exists
    if (!existingUser) {
      return res.status(404).json({ error: "User not found!" });
    }

    if (existingUser?.username !== username) {
      return res
        .status(403)
        .json({ error: "You can only update your own account!" });
    }

    // Hash the password if it was provided
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    // Update the user
    const updatedUser = await User.findOneAndUpdate(
      { username },
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json({
      message: updatedUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the user!" });
  }
};

/**
 * The deleteUser function is an asynchronous function that deletes a user from the database based on
 * the provided user ID, and returns a success message if the deletion is successful.
 */
export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  if (req.body.userId !== req.params.userid) {
    res.status(403).json({
      error: "You can delete only your account!",
    });
  }

  try {
    const userId = await req.params.userid;
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      message: "User deleted successfully.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the user!" });
  }
};

/**
 * The function `getFollowers` is an asynchronous function that retrieves the followers of a user
 * specified by their `userId` and returns them as a JSON response.
 */
export const getFollowers = async (
  req: express.Request,
  res: express.Response
) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    const followers = await User.find({ _id: { $in: user.followers } });
    res.status(200).json({
      message: followers,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch followers!" });
  }
};

/**
 * The function `getFollowing` is an asynchronous function that retrieves the followings of a user
 * specified by their `userId` and returns them as a JSON response.
 */
export const getFollowing = async (
  req: express.Request,
  res: express.Response
) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    const followings = await User.find({ _id: { $in: user.following } });
    res.status(200).json({
      message: followings,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch following!" });
  }
};

/**
 * The `followUser` function allows a logged-in user to follow another user by updating their
 * respective follower and following lists.
 * @returns a JSON response with a message containing the logged-in user object.
 */
export const followUser = async (
  req: AuthenticatedRequest & express.Request,
  res: express.Response
) => {
  const { userId } = req.params;

  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "Unauthorized!" });
  }

  // get userid
  const loggedInUserId = req.user.id;

  try {
    // Find the user to follow
    const userToFollow = await User.findById(userId);
    // also find the current user and update his following list
    const loggedInUser = await User.findById(loggedInUserId);

    if (!userToFollow) {
      return res.status(404).json({ error: "User not found!" });
    }
    if (!loggedInUser) {
      return res.status(404).json({ error: "User not found!" });
    }

    // Add the logged-in user ID to the followers array of the user to follow
    userToFollow?.followers.push(loggedInUserId);

    // save the followed userId to the current user's following field
    loggedInUser?.following.push(userId);

    await userToFollow.save();
    await loggedInUser.save();

    res.status(200).json({ message: loggedInUser });
  } catch (error) {
    res.status(500).json({ error: "Error following user!" });
  }
};

/**
 * The `unFollowUser` function allows a logged-in user to unfollow another user by removing their IDs
 * from each other's followers and following lists.
 */
export const unFollowUser = async (
  req: AuthenticatedRequest & express.Request,
  res: express.Response
) => {
  const { userId } = req.params;

  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "Unauthorized!" });
  }

  // get userid
  const loggedInUserId = req.user.id;

  try {
    // Find the user to follow
    const userToUnfollow = await User.findById(userId);

    if (!userToUnfollow) {
      return res.status(404).json({ error: "User not found!" });
    }
    // also find the current user and update his following list
    const loggedInUser = await User.findById(loggedInUserId);

    if (!loggedInUser) {
      return res.status(404).json({ error: "User not found!" });
    }

    // Remove the logedin user ID from the user followers list you want to unfollow
    const index = userToUnfollow.followers.indexOf(loggedInUserId);
    if (index !== -1) {
      userToUnfollow.followers.splice(index, 1);
    }

    // also remove the unfollowed user from the loggedin user's following list
    const index2 = loggedInUser?.following.indexOf(userId);
    if (index2 !== -1) {
      loggedInUser?.following.splice(index2, 1);
    }

    await userToUnfollow?.save();
    await loggedInUser?.save();

    res.status(200).json({ message: loggedInUser });
  } catch (error) {
    res.status(500).json({ error: "Error following user!" });
  }
};

/**
 * The `activeUser` function updates the active status of a user in the database and returns a success
 * message if the update is successful.
 * If the user is not found, it returns a JSON response with an error message. If there is an error
 * during the update process, it returns a JSON response with an error message.
 */
export const activeUser = async (
  req: express.Request,
  res: express.Response
) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    res.status(200).json({
      message: "Active status updated successfully.",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user active status!" });
  }
};

/**
 * The userActivity function retrieves a user's liked posts based on the provided user ID, limit, and
 * last post ID.
 */
export const userActivity = async (
  req: express.Request,
  res: express.Response
) => {
  const { userId } = req.params;
  const { limit, lastPostId } = req.query;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    const query: any = { _id: { $in: user.activities } };

    if (lastPostId) {
      query._id = { $lt: lastPostId };
    }

    let options: any = {};

    if (limit) {
      options.limit = parseInt(limit.toString());
    }

    const likedPosts = await Post.find(query, null, options).sort({
      createdAt: -1,
    });

    res.status(200).json({
      message: likedPosts,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch the user activity!",
    });
  }
};

// sending the visiting user ID to the server and store it
/**
 * The function `getVisitingUser` is an asynchronous function that retrieves a user's profile and
 * stores the visitor's ID in the user's profileVisitors array.
 */
export const getVisitingUser = async (
  req: AuthenticatedRequest & express.Request,
  res: express.Response
) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized!" });
    }

    // get visitorId
    const visitorId = req.user.id;

    // save the visitor userid to the profilevisitor array of a user
    user?.profileVisitors?.push(visitorId);

    await user.save();

    res.status(200).json({ message: "Stored the visior to the database." });
  } catch (error) {
    res.status(500).json({ error: "Failed to store the visitor!" });
  }
};

/**
 * The function `getProfileVisitors` retrieves the profile visitors of a user and returns them in
 * descending order of creation.
 */
export const getProfileVisotors = async (
  req: express.Request,
  res: express.Response
) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    const profileVisitors = await User.find({
      _id: { $in: user.profileVisitors },
    })
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .exec();

    res.status(200).json({
      message: profileVisitors,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile visitor!" });
  }
};
