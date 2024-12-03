const express = require("express");

const router = express.Router();

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
} = require("../services/userService");

router.route("/").get(getUsers).post(uploadUserImage, resizeImage, createUser);

router
  .route("/:id")
  .get(getUser)
  .put(uploadUserImage, resizeImage, updateUser)
  .delete(deleteUser);

module.exports = router;
