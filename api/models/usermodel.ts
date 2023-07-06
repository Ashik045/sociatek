import mongoose from "mongoose";

interface IUser {
  username: string;
  fullname: string;
  email: string;
  password: string;
  about: string;
  phone: string;
  facebook: string;
  isActive: boolean;
  location: string;
  profession: "student" | "worker";
  profilePicture?: string;
  coverPhoto?: string;
  followers: string[];
  following: string[];
  activities: string[];
  profileVisitors: string[];
}

// user schema
const UserSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    fullname: { type: String, required: true, default: "Unnamed User" },
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
    location: { type: String, required: true },
    isActive: { type: Boolean, default: false },
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
    profileVisitors: { type: [String], default: [] },
  },
  { timestamps: true }
);

// user model
const User = mongoose.model<IUser>("User", UserSchema);

export { IUser, User };
