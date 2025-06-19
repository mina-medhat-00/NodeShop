import express from "express";
import { auth, allow } from "../services/authService.js";
import {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  changePasswordValidator,
  deleteUserValidator,
  updateLoggedUserValidator,
} from "../utils/validator/userValidator.js";
import {
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
} from "../services/userService.js";

const router = express.Router();
// Logged User
// add auth route for token authentication
router.use(auth);

router.get("/getMe", getLoggedUser, getUser);
router.put("/changeMyPassword", changeLoggedUserPassword);
router.put("/updateMe", updateLoggedUserValidator, updateLoggedUserData);
router.put("/deleteMe", deleteLoggedUser);

// Admin User
// add auth route for admin privileges
router.use(allow("admin"));
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

export default router;
