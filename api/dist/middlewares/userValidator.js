"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.followUserMiddleware = exports.getFollowingValidation = exports.getFollowersValidation = exports.UserRegValidationHandler = exports.UserUpdValidation = exports.UserRegValidation = void 0;
const express_validator_1 = require("express-validator");
const http_errors_1 = __importDefault(require("http-errors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// internal imports
const usermodel_1 = require("../models/usermodel");
exports.UserRegValidation = [
    (0, express_validator_1.check)("username")
        .isLength({ min: 3, max: 15 })
        .withMessage("Username should be 3-15 characters!")
        .trim()
        .custom(async (value) => {
        try {
            const user = await usermodel_1.User.findOne({ username: value });
            if (user) {
                throw (0, http_errors_1.default)("Username already in use!");
            }
        }
        catch (errrr) {
            throw (0, http_errors_1.default)("Username already in use!");
        }
    }),
    (0, express_validator_1.check)("fullname")
        .isLength({ min: 1 })
        .withMessage("Fullname is required!")
        .trim(),
    (0, express_validator_1.check)("email")
        .isEmail()
        .withMessage("Invalid email address!")
        .trim()
        .custom(async (value) => {
        try {
            const user = await usermodel_1.User.findOne({ email: value });
            if (user) {
                throw (0, http_errors_1.default)("Email already exists!");
            }
        }
        catch (errrr) {
            throw (0, http_errors_1.default)("Email already in use!");
        }
    }),
    (0, express_validator_1.check)("password")
        .isStrongPassword()
        .withMessage("Password should be at least 6 characters & should contain at least 1 lowercase, 1 upper case, 1 number & 1 symbol"),
    (0, express_validator_1.check)("about").isLength({ min: 1 }).withMessage("About field is required!"),
];
exports.UserUpdValidation = [
    (0, express_validator_1.check)("username")
        .isLength({ min: 3, max: 15 })
        .withMessage("Username should be 3-15 characters!")
        .trim(),
    (0, express_validator_1.check)("fullname")
        .isLength({ min: 1 })
        .withMessage("Fullname is required!")
        .trim(),
    (0, express_validator_1.check)("email").isEmail().withMessage("Invalid email address!").trim(),
    (0, express_validator_1.check)("about").isLength({ min: 1 }).withMessage("About field is required!"),
];
const UserRegValidationHandler = function (req, res, next) {
    const errors = (0, express_validator_1.validationResult)(req);
    const mappedErrs = errors.mapped();
    if (Object.keys(mappedErrs).length === 0) {
        next();
    }
    else {
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
exports.UserRegValidationHandler = UserRegValidationHandler;
// Validation handler for the getFollowers route
exports.getFollowersValidation = [
    (0, express_validator_1.param)("userId").notEmpty().withMessage("User ID is required"),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];
// Validation handler for the getFollowing route
exports.getFollowingValidation = [
    (0, express_validator_1.param)("userId").notEmpty().withMessage("User ID is required"),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];
const followUserMiddleware = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
        const token = authorizationHeader.slice(7); // Remove the "Bearer " prefix
        try {
            const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY || "");
            req.user = { id: decodedToken.id }; // Set the user ID on the request object
            next();
        }
        catch (error) {
            res.status(401).json({ error: "Unauthorized" });
        }
    }
    else {
        res.status(401).json({ error: "Unauthorized" });
    }
};
exports.followUserMiddleware = followUserMiddleware;
