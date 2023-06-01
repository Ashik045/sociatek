"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.followUser = exports.getFollowing = exports.getFollowers = exports.deleteUser = exports.updateUser = exports.getUserByUserName = exports.getUserById = exports.getAllUsers = void 0;
// external import
const bcrypt_1 = __importDefault(require("bcrypt"));
// internal import
const usermodel_1 = require("../models/usermodel");
// get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await usermodel_1.User.find().sort({ createdAt: -1 });
        res.status(200).json({
            message: users,
        });
    }
    catch (error) {
        res.status(500).json({
            error: "Can not find any user!",
        });
    }
};
exports.getAllUsers = getAllUsers;
// get user by userId
const getUserById = async (req, res) => {
    try {
        const user = await usermodel_1.User.findById(req.params.userid);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const { password: _pw, ...userInfo } = user.toObject();
        res.status(200).json({
            message: userInfo,
        });
    }
    catch (error) {
        res.status(500).json({
            error: "Can not find user!",
        });
    }
};
exports.getUserById = getUserById;
// get user by userName
const getUserByUserName = async (req, res) => {
    const username = req.params.username;
    try {
        const user = await usermodel_1.User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }
        const { password: _pw, ...userInfo } = user.toObject();
        res.status(200).json({
            message: userInfo,
        });
    }
    catch (error) {
        res.status(500).json({
            error: "Can not find user!",
        });
    }
};
exports.getUserByUserName = getUserByUserName;
// update user
const updateUser = async (req, res) => {
    // const username = req.body.username;
    // const isUser = await User.findOne({ username: username });
    const username = await req.params.username;
    const existingUser = await usermodel_1.User.findOne({ username });
    try {
        // Check if the user exists
        if (!existingUser) {
            return res.status(404).json({ error: "User not found!" });
        }
        if (existingUser?.username !== username) {
            return res
                .status(403)
                .json({ error: "You can only update your own account!" });
        }
        // Hash the password if it was provided
        if (req.body.password) {
            req.body.password = await bcrypt_1.default.hash(req.body.password, 10);
        }
        // Update the user
        const updatedUser = await usermodel_1.User.findOneAndUpdate({ username }, {
            $set: req.body,
        }, { new: true });
        res.status(200).json({
            message: updatedUser,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ error: "An error occurred while updating the user!" });
    }
};
exports.updateUser = updateUser;
// delete user
const deleteUser = async (req, res) => {
    if (req.body.userId !== req.params.userid) {
        res.status(403).json({
            error: "You can delete only your account!",
        });
    }
    try {
        const userId = await req.params.userid;
        await usermodel_1.User.findByIdAndDelete(userId);
        res.status(200).json({
            message: "User deleted successfully.",
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ error: "An error occurred while deleting the user!" });
    }
};
exports.deleteUser = deleteUser;
// get followers of a particular user
const getFollowers = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await usermodel_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }
        const followers = await usermodel_1.User.find({ _id: { $in: user.followers } });
        res.status(200).json({
            message: followers,
        });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch followers!" });
    }
};
exports.getFollowers = getFollowers;
// get followings of a particular user
const getFollowing = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await usermodel_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }
        const followings = await usermodel_1.User.find({ _id: { $in: user.following } });
        res.status(200).json({
            message: followings,
        });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch following!" });
    }
};
exports.getFollowing = getFollowing;
// POST request to follow a user
const followUser = async (req, res) => {
    const { userId } = req.params;
    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Unauthorized!" });
    }
    // get userid
    const loggedInUserId = req.user.id;
    try {
        // Find the user to follow
        const userToFollow = await usermodel_1.User.findById(userId);
        // also find the current user and update his following list
        const loggedInUser = await usermodel_1.User.findById(loggedInUserId);
        if (!userToFollow) {
            return res.status(404).json({ error: "User not found!" });
        }
        if (!loggedInUser) {
            return res.status(404).json({ error: "User not found!" });
        }
        // Add the logged-in user ID to the followers array of the user to follow
        userToFollow?.followers.push(loggedInUserId);
        // save the followed userId to the current user's following field
        loggedInUser?.following.push(userId);
        await userToFollow?.save();
        await loggedInUser?.save();
        res.status(200).json({ message: loggedInUser });
    }
    catch (error) {
        res.status(500).json({ error: "Error following user!" });
    }
};
exports.followUser = followUser;
