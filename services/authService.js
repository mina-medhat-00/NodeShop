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
exports.signin = asyncHandler(async (req, res, next) => {
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

// @description   Authenticate user with token
exports.auth = asyncHandler(async (req, res, next) => {
  // 1. check if token exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new ApiError("login to use the following features", 401));
  }
  // 2. verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  // 3. check if user exists
  const user = await User.findById(decoded.userID);
  if (!user) {
    return next(
      new ApiError(
        "the token's user no longer exist, login again is required",
        401
      )
    );
  }
  // 4. check for password change
  if (user.changePasswordAt) {
    const changePasswordTimestamp = parseInt(user.changePasswordAt / 1000, 10);
    if (changePasswordTimestamp > decoded.iat) {
      return next(
        new ApiError(
          "recent password change has occurred, please login again",
          401
        )
      );
    }
  }
  req.user = user;
  next();
});

// @description   Allow specific roles route access
exports.allow = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("this route requires admin or manager privileges", 403)
      );
    }
    next();
  });
