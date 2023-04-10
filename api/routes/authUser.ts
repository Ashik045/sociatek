// external imports
import express from "express";

// internal imports
import {
  userLoginHandler,
  userRegHandler,
} from "../controllers/authController";
import {
  UserRegValidation,
  UserRegValidationHandler,
} from "../middlewares/userValidator";

const router = express.Router();

// login route
router.post("/auth/login", userLoginHandler);

// login route
router.post(
  "/auth/signup",
  UserRegValidation,
  UserRegValidationHandler,
  userRegHandler
);

export default router;
