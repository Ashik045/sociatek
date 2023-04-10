// external import
import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  getUserByUserName,
  updateUser,
} from "../controllers/userController";
import {
  UserRegValidation,
  UserRegValidationHandler,
} from "../middlewares/userValidator";

// internal import

const router = express.Router();

// get all users
router.get("/users/all", getAllUsers);

// get user by userId
router.get("/user/:userid", getUserById);

// get user by username
router.get("/user", getUserByUserName);

// update user
router.put(
  "/user/:userid",
  UserRegValidation,
  UserRegValidationHandler,
  updateUser
);

// delete user
router.delete("/user/:userid", deleteUser);

export default router;
