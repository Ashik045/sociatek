// external import
import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUserByUserName,
  updateUser,
} from "../controllers/userController";
import {
  UserRegValidationHandler,
  UserUpdValidation,
} from "../middlewares/userValidator";

// internal import

const router = express.Router();

// get all users
router.get("/users/all", getAllUsers);

// get user by username
router.get("/user/:username", getUserByUserName);

// get user by username
router.get("/user", getUserByUserName);

// update user
router.put(
  "/user/:username",
  UserUpdValidation,
  UserRegValidationHandler,
  updateUser
);

// delete user
router.delete("/user/:userid", deleteUser);

export default router;
