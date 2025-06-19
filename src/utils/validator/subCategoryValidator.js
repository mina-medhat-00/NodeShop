import slugify from "slugify";
import { body, check } from "express-validator";
import validatorMiddleware from "../../middleware/validatorMiddleware.js";

export const getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subCategory id format"),
  validatorMiddleware,
];

export const createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("subCategory required")
    .isLength({ min: 2 })
    .withMessage("Too short subCategory name")
    .isLength({ max: 32 })
    .withMessage("Too long subCategory name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("SubCategory must belong to a category")
    .isMongoId()
    .withMessage("Invalid Category id format"),
  validatorMiddleware,
];

export const updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subCategory id format"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

export const deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subCategory id format"),
  validatorMiddleware,
];
