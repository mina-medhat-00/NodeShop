const express = require("express");

const router = express.Router();

const authService = require("../services/authService");

const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  changePasswordValidator,
  deleteUserValidator,
} = require("../utils/validator/userValidator");

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  changePassword,
  deleteUser,
  uploadUserImage,
  resizeImage,
  getUserData,
} = require("../services/userService");

// add auth route
router.use(authService.auth, authService.allow("admin"));

router.get("/getUserData", authService.auth, getUserData, getUser);

router.put("/changePassword/:id", changePasswordValidator, changePassword);

router
  .route("/")
  .get(getUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, createUser);

router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
