const express = require("express");

const router = express.Router();

const {
  signupValidator,
  signinValidator,
} = require("../utils/validator/authValidator");

const {
  signup,
  signin,
  forgetPassword,
  verifyResetPassword,
} = require("../services/authService");

router.post("/signup", signupValidator, signup);
router.post("/signin", signinValidator, signin);
router.post("/forgetPassword", forgetPassword);
router.post("/verifyResetPassword", verifyResetPassword);

module.exports = router;
