const express = require("express");

const router = express.Router();

// routing from validator
const {
  signupValidator,
  signinValidator,
} = require("../utils/validator/authValidator");

// routing from services
const { signup, signin } = require("../services/authService");

router.route("/signup").post(signupValidator, signup);
router.route("/signin").post(signinValidator, signin);

// router
//   .route("/:id")
//   .get(getUserValidator, getUser)
//   .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
//   .delete(deleteUserValidator, deleteUser);

module.exports = router;
