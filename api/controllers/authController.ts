// external imports
import bcrypt from "bcrypt";
import express from "express";
import jwt, { Secret } from "jsonwebtoken";

// internal import
import { User } from "../models/usermodel";

/**
 The userLoginHandler function is responsible for handling user login requests, checking if the provided email or username matches an existing user, verifying the password, and generating a JWT token for authentication.
 */
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

        // create the jwt token
        const jwtSecret: Secret = process.env.JWT_SECRET_KEY || "";
        const payload = {
          id: user._id,
          username: user.username,
          email: user.email,
        };
        const jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: "3d" });

        res.status(200).json({
          message: userDetail,
          jwtToken,
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

//  The userRegHandler function handles user registration by checking if the email and username are already in use, hashing the password, creating a new user object, and saving it to the database.

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
