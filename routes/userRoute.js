const express = require("express");

const router = express.Router();

const authService = require("../services/authService");

const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  changePasswordValidator,
  deleteUserValidator,
  updateLoggedUserValidator,
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
  getLoggedUser,
  changeLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUser,
} = require("../services/userService");

// Logged User
// add auth route for token authentication
router.use(authService.auth);

router.get("/getMe", getLoggedUser, getUser);
router.put("/changeMyPassword", changeLoggedUserPassword);
router.put("/updateMe", updateLoggedUserValidator, updateLoggedUserData);
router.put("/deleteMe", deleteLoggedUser);

// Admin User
// add auth route for admin privileges
router.use(authService.allow("admin"));
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
