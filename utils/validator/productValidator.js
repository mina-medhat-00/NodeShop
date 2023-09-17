const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const Category = require("../../models/categoryModel");
const SubCategory = require("../../models/subCategoryModel");

exports.createProductValidator = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("Must be at least 3 characters length")
    .notEmpty()
    .withMessage("Product required"),
  check("description")
    .notEmpty()
    .withMessage("Product description required")
    .isLength({ max: 2000 })
    .withMessage("Maximum description length 2000 characters"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 32 })
    .withMessage("Too long price length"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Price after discount be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error(
          "Price after discount must be lower than current price"
        );
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("Available colors should be an array of string type"),
  check("imageCover").notEmpty().withMessage("Image cover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("Images should be an array of string type"),

  check("category")
    .notEmpty()
    .withMessage("Product must belong to a category")
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom(async (categoryId) => {
      const category = await Category.findById(categoryId);
      if (!category) {
        throw new Error(`No category for this id: ${categoryId}`);
      }
    }),

  check("subCategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom((subCategoriesIds) =>
      SubCategory.find({ _id: { $exists: true, $in: subCategoriesIds } }).then(
        (result) => {
          if (result.length < 1 || result.length !== subCategoriesIds.length) {
            return Promise.reject(new Error(`Invalid subCategories Ids`));
          }
        }
      )
    )
    .custom((value, { req }) =>
      SubCategory.find({ category: req.body.category }).then(
        (subCategories) => {
          const subCategoriesIdsInDB = [];
          subCategories.forEach((subCategory) => {
            subCategoriesIdsInDB.push(subCategory._id.toString());
          });
          const checker = (target, arr) => target.every((v) => arr.includes(v));
          if (!checker(value, subCategoriesIdsInDB)) {
            return Promise.reject(
              new Error(`Subcategories don't belong to category`)
            );
          }
        }
      )
    ),

  check("brand").optional().isMongoId().withMessage("Invalid id format"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("Average Ratings must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be at least 1 star")
    .isLength({ max: 5 })
    .withMessage("Ratings must be 5 stars max"),
  check("ratingQuantity")
    .optional()
    .isNumeric()
    .withMessage("Ratings quantity must be a number"),
  validatorMiddleware,
];

exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid id format"),
  validatorMiddleware,
];
exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid id format"),
  validatorMiddleware,
];
exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid id format"),
  validatorMiddleware,
];
