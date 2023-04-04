import mongoose from "mongoose";

// user schema
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: "string",
      required: true,
      unique: true,
    },
    fullname: { type: "string", required: true },
    email: { type: "string", required: true, unique: true },
    password: { type: "string", required: true },
    about: { type: "string", required: true },
    phone: { type: "string", required: true },
    location: { type: "string", required: true },
    profession: { type: "string", required: true },
    profilePicture: { type: "string", required: true },
    coverPhoto: { type: "string", required: true },
    followers: { type: Array, default: [] },
    following: { type: Array, default: [] },
    activities: { type: Array, default: [] },
  },
  { timestamps: true }
);

// user model
const User = mongoose.model("User", UserSchema);

export default User;
