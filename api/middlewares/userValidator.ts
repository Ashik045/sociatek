// external imports
import express from "express";
import { check, validationResult } from "express-validator";
import createError from "http-errors";

// internal imports
import { User } from "../models/usermodel";

export const UserRegValidation = [
  check("username")
    .isLength({ min: 3, max: 10 })
    .withMessage("Username should be 3-10 characters!")
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
      "Password should be at least 8 characters & should contain at least 1 lowercase, 1 upper case, 1 number & 1 symbol"
    ),
  check("about").isLength({ min: 1 }).withMessage("About field is required!"),
];

// export const UserUpdValidation = [
//   check("username")
//     .isLength({ min: 3 })
//     .withMessage("Username is required!")
//     .trim(),
//   check("fullname")
//     .isLength({ min: 1 })
//     .withMessage("Fullname is required!")
//     .trim(),
//   check("email")
//     .isEmail()
//     .withMessage("Invalid email address!")
//     .trim()
//     .custom(async (value) => {
//       try {
//         const user = await User.findOne({ email: value });
//         if (user) {
//           throw createError("Email already exists!");
//         }
//       } catch (errrr) {
//         throw createError("Email already in use!");
//       }
//     }),
//   check("password")
//     .isStrongPassword()
//     .withMessage(
//       "Password should be at least 8 characters & should contain at least 1 lowercase, 1 upper case, 1 number & 1 symbol"
//     ),
//   check("about").isLength({ min: 1 }).withMessage("About field is required!"),
// ];

export const UserRegValidationHandler = function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
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
