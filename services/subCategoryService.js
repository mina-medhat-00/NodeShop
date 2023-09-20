const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handlersFactory");

const SubCategory = require("../models/subCategoryModel");

// @description   Get list of subcategories
// @route         POST /api/v1/subcategories
// @access        Public
exports.getSubCategories = asyncHandler(async (req, res) => {
  // Build query
  const documentCount = await SubCategory.countDocuments();
  const features = new ApiFeatures(SubCategory.find(), req.query)
    .paginate(documentCount)
    .filter()
    .search()
    .limitFields()
    .sort();

  // Execute query
  const { mongooseQuery, paginationResult } = features;
  const subCategories = await mongooseQuery;
  res.status(200).json({
    results: subCategories.length,
    paginationResult,
    data: subCategories,
  });
});

// @description   Get specific subCategory by id
// @route         GET /api/v1/subcategories/:id
// @access        Public
exports.getSubCategory = factory.getOne(SubCategory);

// validation middleware when updating subcategories with no category
exports.setCategoryIdToBody = (req, res, next) => {
  // Nested route
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// @description   create subcategory
// @route         POST /api/v1/subcategories
// @access        Private
exports.createSubCategory = factory.createOne(SubCategory);

// Nested Route
// GET /api/v1/categories/:categoryId/subcategories
// GET /api/v1/products/:productId/review

exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObject = filterObject;
  next();
};

// @description   Update specific subcategory
// @route         PUT /api/v1/subcategories/:id
// @access        Private
exports.updateSubCategory = factory.updateOne(SubCategory);
// @description   Delete specific subcategory
// @route         DELETE /api/v1/subcategories/:id
// @access        Private
exports.deleteSubCategory = factory.deleteOne(SubCategory);
