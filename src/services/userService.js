import sharp from "sharp";
import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

import ApiError from "../utils/apiError.js";
import { uploadSingleImage } from "../middleware/uploadImageMiddleware.js";
import { getOne, getAll, createOne, deleteOne } from "./handlersFactory.js";
import User from "../models/userModel.js";
import createToken from "../utils/createToken.js";

// Upload Single Image
export const uploadUserImage = uploadSingleImage("profilePic");

// Image Processing
export const resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
  // profile picture is optional
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/users/${filename}`);

    req.body.profilePic = filename;
  }
  next();
});

// @description   Get list of users
// @route         POST /api/users
// @access        Private
export const getUsers = getAll(User);

// @description   Get specific user by id
// @route         GET /api/users/:id
// @access        Private
export const getUser = getOne(User);

// @description   create brand
// @route         POST /api/users
// @access        Private
export const createUser = createOne(User);

// @description   Update specific user
// @route         PUT /api/users/:id
// @access        Private
export const updateUser = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phone: req.body.phone,
      profilePic: req.body.profilePic,
      role: req.body.role,
    },
    {
      new: true,
    }
  );

  if (!updatedUser) {
    return next(new ApiError(`No user for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: updatedUser });
});

// @description   Change user password
// @route         PUT /api/users/changePassword/:id
// @access        Private
export const changePassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      changePasswordAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

// @description   Delete specific user
// @route         DELETE /api/users/:id
// @access        Private
export const deleteUser = deleteOne(User);

// @description   Get logged user data
// @route         GET /api/users/getMe
// @access        Private/Protect
export const getLoggedUser = asyncHandler((req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @description   Change logged user password
// @route         GET /api/users/changeMyPassword
// @access        Private/Protect
export const changeLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      changePasswordAt: Date.now(),
    },
    {
      new: true,
    }
  );

  const token = createToken(req.body.password, 12);
  res.status(200).json({ data: user, token });
});

// @description   Update logged user data (password,role,active are not included)
// @route         GET /api/users/updateMe
// @access        Private/Protect
export const updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true }
  );
  res.status(200).json({ data: updatedUser });
});

// @description   Deactivate logged user account
// @route         GET /api/users/deleteMe
// @access        Private/Protect
export const deleteLoggedUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).json({ status: "deactivation successful" });
});
