const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const User = require("../models/userModel");

const generateToken = (payload) =>
  jwt.sign({ userID: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

// @description   Signup
// @route         POST /api/v1/auth/signup
// @access        Public
exports.signup = asyncHandler(async (req, res, next) => {
  // create user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  // generate token
  const token = generateToken(user._id);
  // return response to client
  res.status(201).json({ data: user, token });
});

// @description   Login
// @route         POST /api/v1/auth/login
// @access        Public
exports.login = asyncHandler(async (req, res, next) => {
  // check for correct password and if user exists
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("invalid login credentials", 401));
  }
  // generate token
  const token = generateToken(user._id);
  // return response to client
  res.status(200).json({ data: user, token });
});
