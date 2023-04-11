// external imports
import bcrypt from "bcrypt";
import express from "express";

// internal import
import { User } from "../models/usermodel";

// login handler
export const userLoginHandler = async (
  req: express.Request,
  res: express.Response
) => {
  const { emailOrUsername, password } = req.body;

  try {
    // check if the username or email matches
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (user) {
      // check if the password is correct
      const isRightPassword = await bcrypt.compare(password, user.password);

      // if the password is correct then login and send the user as a result
      if (isRightPassword) {
        const { password: _pw, ...userDetail } = user.toObject();

        res.status(200).json({
          message: userDetail,
        });
      } else {
        res.status(401).json({
          error: "Incorrect email/username or password!",
        });
      }
    } else {
      res.status(401).json({
        error: "Incorrect email/username or password!",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Login failed!",
    });
  }
};

// user register handler
export const userRegHandler = async (
  req: express.Request,
  res: express.Response
) => {
  const { email, password, username } = req.body;

  try {
    const isEmail = await User.findOne({ email: email });
    const isUserName = await User.findOne({ username: username });

    // check if useremail or username is already in use
    if (!isEmail) {
      if (!isUserName) {
        // hashing the password
        const hashPassword = await bcrypt.hash(password, 10);

        // create a new user object
        const newUser = await new User({
          ...req.body,
          password: hashPassword,
        });

        newUser.save();

        res.status(200).json({
          message: newUser,
        });
      } else {
        res.status(500).json({
          error: "Username already in use!",
        });
      }
    } else {
      res.status(500).json({
        error: "Email already in use!",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "User registration failed!",
    });
  }
};
