// @ts-ignore

const express = require("express");

// internal imports
// @ts-ignore

const {
  userLoginHandler,
  userRegHandler,
} = require("../controllers/authController");

const router = express.Router();

// login route
router.get("/login", userLoginHandler);

// login route
router.get("/signup", userRegHandler);

module.exports = router;
