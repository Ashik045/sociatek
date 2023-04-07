import mongoose from "mongoose";

// user schema
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    fullname: { type: String, required: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: { type: String, required: true },
    about: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, required: true },
    profession: {
      type: String,
      enum: ["student", "worker"],
      default: "student",
      required: true,
    },
    profilePicture: { type: String },
    coverPhoto: { type: String },
    followers: { type: Array, default: [] },
    following: { type: Array, default: [] },
    activities: { type: Array, default: [] },
  },
  { timestamps: true }
);

// user model
const User = mongoose.model("User", UserSchema);

export default User;
