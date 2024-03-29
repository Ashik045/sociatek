// external import
import express from "express";
import {
  activeUser,
  deleteUser,
  followUser,
  getAllUsers,
  getFollowers,
  getFollowing,
  getProfileVisotors,
  getUserByUserName,
  getVisitingUser,
  unFollowUser,
  updateUser,
  userActivity,
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

// send a follow request to a user
router.post("/user/follow/:userId", followUserMiddleware, followUser as any);

// send a unfollow request
router.post(
  "/user/unfollow/:userId",
  followUserMiddleware,
  unFollowUser as any
);

// update the user active status
router.get("/user/active/:userId", activeUser);

// get the user activities
router.get("/user/activities/:userId", userActivity);

// send the visiting user ID to the server and store it to a user profile
router.get("/user/visit/:userId", followUserMiddleware, getVisitingUser as any);

// send the visiting user ID to the server and store it to a user profile
router.get("/user/:userId/visitors", getProfileVisotors);

export default router;
