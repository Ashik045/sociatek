// external import
import bcrypt from "bcrypt";
import express from "express";

// internal import
import { User } from "../models/usermodel";

// get all users
export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: users,
    });
  } catch (error) {
    res.status(500).json({
      error: "Can not find any user!",
    });
  }
};

// get user by userId
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

// get user by userName
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

// update user
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

// delete user
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

// get followers of a particular user
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

// get followings of a particular user
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

// POST request to follow a user
// export const followUser = async (
//   req: express.Request,
//   res: express.Response
// ) => {
//   const { userId } = req.params;
//   const loggedInUserId = req.user.id;

//   try {
//     // Find the user to follow
//     const userToFollow = await User.findById(userId);

//     // Add the logged-in user ID to the followers array of the user to follow
//     userToFollow?.followers.push(loggedInUserId);
//     await userToFollow?.save();

//     res.status(200).json({ message: "User followed successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error following user" });
//   }
// };
