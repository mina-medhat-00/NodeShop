const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

const ApiError = require("../utils/apiError");
const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");
const factory = require("./handlersFactory");
const User = require("../models/userModel");

// Upload Single Image
exports.uploadUserImage = uploadSingleImage("profilePic");

// Image Processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
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
// @route         POST /api/v1/users
// @access        Private
exports.getUsers = factory.getAll(User);

// @description   Get specific user by id
// @route         GET /api/v1/users/:id
// @access        Private
exports.getUser = factory.getOne(User);

// @description   create brand
// @route         POST /api/v1/users
// @access        Private
exports.createUser = factory.createOne(User);

// @description   Update specific user
// @route         PUT /api/v1/users/:id
// @access        Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
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

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

// @description   Change user password
// @route         PUT /api/v1/users/changePassword/:id
// @access        Private
exports.changePassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
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
// @route         DELETE /api/v1/users/:id
// @access        Private
exports.deleteUser = factory.deleteOne(User);
