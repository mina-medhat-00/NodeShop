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
} = require("../services/userService");

router.put("/changePassword/:id", changePasswordValidator, changePassword);

router
  .route("/")
  .get(getUsers)
  .post(
    authService.auth,
    authService.allow("admin"),
    uploadUserImage,
    resizeImage,
    createUserValidator,
    createUser
  );

router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(
    authService.auth,
    authService.allow("admin"),
    uploadUserImage,
    resizeImage,
    updateUserValidator,
    updateUser
  )
  .delete(
    authService.auth,
    authService.allow("admin"),
    deleteUserValidator,
    deleteUser
  );

module.exports = router;
