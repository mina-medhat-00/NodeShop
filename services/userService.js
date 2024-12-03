const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");

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
exports.updateUser = factory.updateOne(User);

// @description   Delete specific user
// @route         DELETE /api/v1/users/:id
// @access        Private
exports.deleteUser = factory.deleteOne(User);
