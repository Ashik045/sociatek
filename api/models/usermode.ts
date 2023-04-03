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
    profilePicture: { type: "string", required: true },
    coverPhoto: { type: "string", required: true },
    followers: { type: "boolean", default: 0 },
    following: { type: "boolean", default: 0 },
    activities: { type: "boolean", default: 0 },
  },
  { timestamps: true }
);

// user model
const User = mongoose.model("User", UserSchema);

module.exports = User;
