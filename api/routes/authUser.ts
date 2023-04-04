// external imports
import express from "express";

// internal imports
import {
  userLoginHandler,
  userRegHandler,
} from "../controllers/authController";

const router = express.Router();

// login route
router.post("/login", userLoginHandler);

// login route
router.post("/signup", userRegHandler);

export default router;
