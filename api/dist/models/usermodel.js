"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// user schema
const UserSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    fullname: { type: String, default: "Unnamed User" },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
    },
    password: { type: String, required: true },
    about: { type: String, required: true },
    phone: { type: String },
    facebook: { type: String },
    location: { type: String },
    profession: {
        type: String,
        enum: ["student", "worker"],
        default: "student",
    },
    profilePicture: { type: String },
    coverPhoto: { type: String },
    followers: { type: [String], default: [] },
    following: { type: [String], default: [] },
    activities: { type: [String], default: [] },
}, { timestamps: true });
// user model
const User = mongoose_1.default.model("User", UserSchema);
exports.User = User;
