"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRegHandler = exports.userLoginHandler = void 0;
// external imports
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// internal import
const usermodel_1 = require("../models/usermodel");
// login handler
const userLoginHandler = async (req, res) => {
    const { emailOrUsername, password } = req.body;
    try {
        // check if the username or email matches
        const user = await usermodel_1.User.findOne({
            $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
        });
        if (user) {
            // check if the password is correct
            const isRightPassword = await bcrypt_1.default.compare(password, user.password);
            // if the password is correct then login and send the user as a result
            if (isRightPassword) {
                const { password: _pw, ...userDetail } = user.toObject();
                // create the jwt token
                const jwtSecret = process.env.JWT_SECRET_KEY || "";
                const payload = {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                };
                const jwtToken = jsonwebtoken_1.default.sign(payload, jwtSecret, { expiresIn: "1d" });
                res.status(200).json({
                    message: userDetail,
                    jwtToken,
                });
            }
            else {
                res.status(401).json({
                    error: "Incorrect email/username or password!",
                });
            }
        }
        else {
            res.status(401).json({
                error: "Incorrect email/username or password!",
            });
        }
    }
    catch (error) {
        res.status(500).json({
            error: "Login failed!",
        });
    }
};
exports.userLoginHandler = userLoginHandler;
// user register handler
const userRegHandler = async (req, res) => {
    const { email, password, username } = req.body;
    try {
        const isEmail = await usermodel_1.User.findOne({ email: email });
        const isUserName = await usermodel_1.User.findOne({ username: username });
        // check if useremail or username is already in use
        if (!isEmail) {
            if (!isUserName) {
                // hashing the password
                const hashPassword = await bcrypt_1.default.hash(password, 10);
                // create a new user object
                const newUser = await new usermodel_1.User({
                    ...req.body,
                    password: hashPassword,
                });
                newUser.save();
                res.status(200).json({
                    message: newUser,
                });
            }
            else {
                res.status(500).json({
                    error: "Username already in use!",
                });
            }
        }
        else {
            res.status(500).json({
                error: "Email already in use!",
            });
        }
    }
    catch (error) {
        res.status(500).json({
            error: "User registration failed!",
        });
    }
};
exports.userRegHandler = userRegHandler;
