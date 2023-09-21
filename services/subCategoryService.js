const factory = require("./handlersFactory");
const SubCategory = require("../models/subCategoryModel");

// validation middleware when updating subcategories with no category
exports.setCategoryIdToBody = (req, res, next) => {
  // Nested route
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// Nested Route
// GET /api/v1/categories/:categoryId/subcategories
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObject = filterObject;
  next();
};

// @description   Get list of subcategories
// @route         POST /api/v1/subcategories
// @access        Public
exports.getSubCategories = factory.getAll(SubCategory);

// @description   Get specific subCategory by id
// @route         GET /api/v1/subcategories/:id
// @access        Public
exports.getSubCategory = factory.getOne(SubCategory);

// @description   create subcategory
// @route         POST /api/v1/subcategories
// @access        Private
exports.createSubCategory = factory.createOne(SubCategory);

// @description   Update specific subcategory
// @route         PUT /api/v1/subcategories/:id
// @access        Private
exports.updateSubCategory = factory.updateOne(SubCategory);

// @description   Delete specific subcategory
// @route         DELETE /api/v1/subcategories/:id
// @access        Private
exports.deleteSubCategory = factory.deleteOne(SubCategory);
