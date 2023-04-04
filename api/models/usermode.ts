// @ts-ignore
const mongoose = require("mongoose");

// user schema
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: "string",
      required: true,
    },
    fullname: { type: "string", required: true },
    email: { type: "string", required: true },
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
// @ts-ignore
const User = mongoose.model("User", UserSchema);

module.exports = User;
