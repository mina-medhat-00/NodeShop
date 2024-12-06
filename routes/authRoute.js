const express = require("express");

const router = express.Router();

// routing from validator
const { signupValidator } = require("../utils/validator/authValidator");

// routing from services
const { signup } = require("../services/authService");

router.route("/signup").post(signupValidator, signup);

// router
//   .route("/:id")
//   .get(getUserValidator, getUser)
//   .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
//   .delete(deleteUserValidator, deleteUser);

module.exports = router;
