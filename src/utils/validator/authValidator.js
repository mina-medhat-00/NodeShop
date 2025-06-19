import slugify from "slugify";
import { check } from "express-validator";

import validatorMiddleware from "../../middleware/validatorMiddleware.js";
import User from "../../models/userModel.js";

export const signupValidator = [
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
        throw new Error("password and password confirmation are not equal");
      return true;
    }),

  check("confirmPassword")
    .notEmpty()
    .withMessage("password confirmation required"),
  validatorMiddleware,
];

export const signinValidator = [
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format"),

  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("passwords should be between 8 and 32 characters length")
    .isLength({ max: 32 })
    .withMessage("passwords should be between 8 and 32 characters length"),
  validatorMiddleware,
];
