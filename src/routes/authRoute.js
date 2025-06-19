import express from "express";
import {
  signupValidator,
  signinValidator,
} from "../utils/validator/authValidator.js";
import {
  signup,
  signin,
  forgetPassword,
  verifyResetPassword,
} from "../services/authService.js";

const router = express.Router();

router.post("/signup", signupValidator, signup);
router.post("/signin", signinValidator, signin);
router.post("/forgetPassword", forgetPassword);
router.post("/verifyResetPassword", verifyResetPassword);
router.put("/resetPassword", verifyResetPassword);

export default router;
