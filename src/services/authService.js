import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";

import ApiError from "../utils/apiError.js";
import User from "../models/userModel.js";
import sendEmail from "../utils/sendEmails.js";
import createToken from "../utils/createToken.js";

// @description   Authenticate user with token
export const auth = asyncHandler(async (req, res, next) => {
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
export const allow = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("this route requires admin or manager privileges", 403)
      );
    }
    next();
  });

// @description   Signup
// @route         POST /api/v1/auth/signup
// @access        Public
export const signup = asyncHandler(async (req, res, next) => {
  // create user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  // generate token
  const token = createToken(user._id);
  // return response to client
  res.status(201).json({ data: user, token });
});

// @description   Login
// @route         POST /api/v1/auth/signin
// @access        Public
export const signin = asyncHandler(async (req, res, next) => {
  // check for correct password and if user exists
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("invalid login credentials", 401));
  }
  // generate token
  const token = createToken(user._id);
  // return response to client
  res.status(200).json({ data: user, token });
});

// @description   Forget password feature
// @route         POST /api/v1/auth/forgetPassword
// @access        Public
export const forgetPassword = asyncHandler(async (req, res, next) => {
  // 1. check if user exists
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(
      new ApiError(`the following email does not exist ${req.body.email}`, 404)
    );

  // 2. create a reset password code
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const resetCodeHash = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  user.resetPasswordCode = resetCodeHash;
  // password reset codes expire in 10 minutes
  user.resetPasswordCodeExpiry = Date.now() + 10 * 60 * 1000;
  user.resetPasswordVerify = false;
  await user.save();

  // 3. send reset code via email
  const message = `Hi ${user.name},\nThe code for password reset as requested is ${resetCode}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Reset password code",
      text: message,
    });
  } catch (error) {
    // ensure no faulty data is saved to database
    user.resetPasswordCode = undefined;
    user.resetPasswordCodeExpiry = undefined;
    user.resetPasswordVerify = undefined;
    await user.save();
    return next(
      new ApiError("server encountered an error please try again later", 500)
    );
  }

  res.status(200).json({
    status: "success",
    message: "reset password email send",
  });
});

// @description   Verify reset password code
// @route         POST /api/v1/auth/verifyResetPassword
// @access        Public
export const verifyResetPassword = asyncHandler(async (req, res, next) => {
  const resetCodeHash = crypto
    .createHash("sha256")
    .update(req.body.resetPasswordCode)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordCode: resetCodeHash,
    resetPasswordCodeExpiry: { $gt: Date.now() },
  });

  if (!user) return next(ApiError("invalid or expired code"));

  user.resetPasswordVerify = true;
  await user.save();
  res.status(200).json({ status: "success" });
});

// @description   Reset user password
// @route         PUT /api/v1/auth/resetPassword
// @access        Public
export const resetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  // 1. check if user exists
  if (!user) return next(new ApiError("email is not registered", 404));
  // 2. check for correct reset code
  if (!user.resetPasswordVerify)
    return next(new ApiError("reset password unverified"));
  // update user password
  user.password = req.body.password;
  user.resetPasswordCode = undefined;
  user.resetPasswordCodeExpiry = undefined;
  user.resetPasswordVerify = undefined;
  await user.save();
  // 3. create new token
  const token = createToken(user._id);
  req.status(200).json({ token });
});

