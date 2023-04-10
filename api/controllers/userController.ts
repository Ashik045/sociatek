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
  const username = req.query.username;

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

// get user by userId
// export const updateUser = async (
//   req: express.Request,
//   res: express.Response
// ) => {
//   try {
//     const username = await req.body.username;
//     const isUser = await User.findOne({ username });

//     if (!isUser) {
//       if (req.body.userId === req.params.id) {
//         if (req.body.password) {
//           req.body.password = await bcrypt.hash(req.body.password, 10);
//         }

//         // update the  user by findByIdAndUpdate method
//         try {
//           const user = await User.findByIdAndUpdate(
//             req.params.id,
//             {
//               $set: req.body,
//             },
//             { new: true }
//           );

//           res.status(200).json({
//             message: user,
//           });
//         } catch (error) {
//           res.status(500).json({
//             error: "can not find user!",
//           });
//         }
//       } else {
//         res.status(500).json({
//           error: "You can only update your account!",
//         });
//       }
//     } else {
//       res.status(500).json({
//         error: "User not found!",
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       error: "Can not find user!",
//     });
//   }
// };

// get user by userId
export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  // const username = req.body.username;
  // const isUser = await User.findOne({ username: username });
  const userId = await req.params.userid;
  const existingUser = await User.findById(userId);
  // console.log(userId);

  try {
    // Check if the user exists
    if (!existingUser) {
      return res.status(404).json({ error: "User not found!" });
    }

    if (existingUser._id.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "You can only update your own account!" });
    }

    // Hash the password if it was provided
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
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
