const express = require("express");

const router = express.Router();

// routing from validator
const {
  signupValidator,
  signinValidator,
} = require("../utils/validator/authValidator");

// routing from services
const { signup, signin, forgetPassword } = require("../services/authService");

router.post("/signup", signupValidator, signup);
router.post("/signin", signinValidator, signin);
router.post("/forgetPassword", forgetPassword);

module.exports = router;
