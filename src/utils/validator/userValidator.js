import slugify from "slugify";
import { body, check } from "express-validator";
import bcrypt from "bcryptjs";

import validatorMiddleware from "../../middleware/validatorMiddleware.js";
import User from "../../models/userModel.js";

export const getUserValidator = [
  check("id").isMongoId().withMessage("invalid user id"),
  validatorMiddleware,
];

export const createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("username is required")
    .isLength({ min: 2 })
    .withMessage("usernames are between 2 and 20 characters long")
    .isLength({ max: 20 })
    .withMessage("usernames are between 2 and 20 characters long")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format")
    .custom(async (val) => {
      const user = await User.findOne({ email: val });
      if (user) {
        throw new Error("email address already in use");
      }
    }),

  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("passwords should be between 8 and 32 characters length")
    .isLength({ max: 32 })
    .withMessage("passwords should be between 8 and 32 characters length")
    .custom((password, { req }) => {
      if (password !== req.body.confirmPassword)
        throw new Error("password and password confirmation aren't equal");
      return true;
    }),

  check("confirmPassword")
    .notEmpty()
    .withMessage("password confirmation required"),

  check("phone")
    .optional()
    .isMobilePhone("ar-EG")
    .withMessage("only egyptian phone numbers allowed"),

  check("profilePic").optional(),

  check("role").optional(),
  validatorMiddleware,
];

export const updateUserValidator = [
  check("id").isMongoId().withMessage("invalid user id"),

  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),

  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format")
    .custom(async (val) => {
      const user = await User.findOne({ email: val });
      if (user) {
        throw new Error("email address already in use");
      }
    }),

  check("phone")
    .optional()
    .isMobilePhone("ar-EG")
    .withMessage("only egyptian phone numbers allowed"),

  check("profilePic").optional(),

  check("role").optional(),
  validatorMiddleware,
];

export const changePasswordValidator = [
  body("currentPassword")
    .notEmpty()
    .withMessage("current password is required"),
  body("password")
    .notEmpty()
    .withMessage("new password is required")
    .custom(async (val, { req }) => {
      // Verify user password
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error("invalid user id");
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("current password is incorrect");
      }
      // Verify password confirmation
      if (val !== req.body.confirmNewPassword) {
        throw new Error("password and password confirmation don't match");
      }
      return true;
    }),
  body("confirmNewPassword")
    .notEmpty()
    .withMessage("password confirmation is required"),
  validatorMiddleware,
];

export const deleteUserValidator = [
  check("id").isMongoId().withMessage("invalid user id"),
  validatorMiddleware,
];

// Validation functions for the logged user features
export const updateLoggedUserValidator = [
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),

  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format")
    .custom(async (val) => {
      const user = await User.findOne({ email: val });
      if (user) {
        throw new Error("email address already in use");
      }
    }),

  check("phone")
    .optional()
    .isMobilePhone("ar-EG")
    .withMessage("only egyptian phone numbers allowed"),
  validatorMiddleware,
];
