// external imports
import { NextFunction, Request, Response } from "express";
import { check, param, validationResult } from "express-validator";
import createError from "http-errors";
import jwt from "jsonwebtoken";

// internal imports
import { User } from "../models/usermodel";
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

export const UserRegValidation = [
  check("username")
    .isLength({ min: 3, max: 15 })
    .withMessage("Username should be 3-15 characters!")
    .trim()
    .custom(async (value) => {
      try {
        const user = await User.findOne({ username: value });
        if (user) {
          throw createError("Username already in use!");
        }
      } catch (errrr) {
        throw createError("Username already in use!");
      }
    }),
  check("fullname")
    .isLength({ min: 1 })
    .withMessage("Fullname is required!")
    .trim(),
  check("email")
    .isEmail()
    .withMessage("Invalid email address!")
    .trim()
    .custom(async (value) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          throw createError("Email already exists!");
        }
      } catch (errrr) {
        throw createError("Email already in use!");
      }
    }),
  check("password")
    .isStrongPassword()
    .withMessage(
      "Password should be at least 6 characters & should contain at least 1 lowercase, 1 upper case, 1 number & 1 symbol"
    ),
  check("about").isLength({ min: 1 }).withMessage("About field is required!"),
];

export const UserUpdValidation = [
  check("username")
    .isLength({ min: 3, max: 15 })
    .withMessage("Username should be 3-15 characters!")
    .trim(),
  check("fullname")
    .isLength({ min: 1 })
    .withMessage("Fullname is required!")
    .trim(),
  check("email").isEmail().withMessage("Invalid email address!").trim(),
  check("about").isLength({ min: 1 }).withMessage("About field is required!"),
];

export const UserRegValidationHandler = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);
  const mappedErrs = errors.mapped();

  if (Object.keys(mappedErrs).length === 0) {
    next();
  } else {
    res.status(500).json({
      error: mappedErrs,
    });
  }

  // format of mapped errors
  // mappedErrs = {
  // name: {
  // msg: "Name is required"
  // },
  // email: {
  // msg: "Invalid email address"
  // }
  // }
};

// Validation handler for the getFollowers route
export const getFollowersValidation = [
  param("userId").notEmpty().withMessage("User ID is required"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation handler for the getFollowing route
export const getFollowingValidation = [
  param("userId").notEmpty().withMessage("User ID is required"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const followUserMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.headers.authorization;

  if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
    const token = authorizationHeader.slice(7); // Remove the "Bearer " prefix

    try {
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY || ""
      ) as { id: string };

      req.user = { id: decodedToken.id }; // Set the user ID on the request object
      next();
    } catch (error) {
      res.status(401).json({ error: "Unauthorized" });
    }
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};
