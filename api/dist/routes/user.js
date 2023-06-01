"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// external import
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const userValidator_1 = require("../middlewares/userValidator");
// internal import
const router = express_1.default.Router();
// get all users
router.get("/users/all", userController_1.getAllUsers);
// get user by username
router.get("/user/:username", userController_1.getUserByUserName);
// get user by username
router.get("/user", userController_1.getUserByUserName);
// update user
router.put("/user/:username", userValidator_1.UserUpdValidation, userValidator_1.UserRegValidationHandler, userController_1.updateUser);
// delete user
router.delete("/user/:userid", userController_1.deleteUser);
// get followers of a particular user
router.get("/user/:userId/followers", userValidator_1.getFollowersValidation, userController_1.getFollowers);
// get following of a particular user
router.get("/user/:userId/followings", userValidator_1.getFollowingValidation, userController_1.getFollowing);
// send a follow request to the database
router.post("/user/follow/:userId", userValidator_1.followUserMiddleware, userController_1.followUser);
exports.default = router;
