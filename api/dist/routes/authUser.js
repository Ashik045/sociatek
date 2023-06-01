"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// external imports
const express_1 = __importDefault(require("express"));
// internal imports
const authController_1 = require("../controllers/authController");
const userValidator_1 = require("../middlewares/userValidator");
const router = express_1.default.Router();
// login route
router.post("/auth/login", authController_1.userLoginHandler);
// login route
router.post("/auth/signup", userValidator_1.UserRegValidation, userValidator_1.UserRegValidationHandler, authController_1.userRegHandler);
exports.default = router;
