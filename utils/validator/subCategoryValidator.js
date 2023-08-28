const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

// exports.getSubCategoryValidator = [
//   check("id").isMongoId().withMessage("Invalid subCategory id format"),
//   validatorMiddleware,
// ];

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("subCategory required")
    .isLength({ min: 2 })
    .withMessage("Too short subCategory name")
    .isLength({ max: 32 })
    .withMessage("Too long subCategory name"),
  check("category")
    .notEmpty()
    .withMessage("SubCategory must belong to a category")
    .isMongoId()
    .withMessage("Invalid Category id format"),
  validatorMiddleware,
];

// exports.updateSubCategoryValidator = [
//   check("id").isMongoId().withMessage("Invalid subCategory id format"),
//   validatorMiddleware,
// ];

// exports.deleteSubCategoryValidator = [
//   check("id").isMongoId().withMessage("Invalid subCategory id format"),
//   validatorMiddleware,
// ];
