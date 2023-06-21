// external import
import express from "express";
import {
  deleteUser,
  followUser,
  getAllUsers,
  getFollowers,
  getFollowing,
  getUserByUserName,
  updateUser,
} from "../controllers/userController";
import {
  UserRegValidationHandler,
  UserUpdValidation,
  followUserMiddleware,
  getFollowersValidation,
  getFollowingValidation,
} from "../middlewares/userValidator";

// internal import

const router = express.Router();

// get all users
router.get("/users/all", getAllUsers);

// // get user by userid
// router.get("/user/:userid", getUserById);

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

// get followers of a particular user
router.get("/user/:userId/followers", getFollowersValidation, getFollowers);

// get following of a particular user
router.get("/user/:userId/followings", getFollowingValidation, getFollowing);

// send a follow request to the database
router.post("/user/follow/:userId", followUserMiddleware, followUser as any);

export default router;
